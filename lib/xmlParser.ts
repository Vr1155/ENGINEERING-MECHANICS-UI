import { XMLParser } from 'fast-xml-parser';
import { evaluate } from 'mathjs';
import { Problem, ProblemShapeData, RigidBody, Point, Force } from '../types/problem';

// Default symbol values for Problem #6
const DEFAULT_SYMBOLS = {
  R: 100,
  P: 10,
  'Sqrt[2]': Math.sqrt(2),
  '√2': Math.sqrt(2),
};

export class ProblemXMLParser {
  private parser: XMLParser;
  private symbols: Record<string, number>;

  constructor(symbols: Record<string, number> = DEFAULT_SYMBOLS) {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@',
    });
    this.symbols = { ...DEFAULT_SYMBOLS, ...symbols };
  }

  /**
   * Evaluates a mathematical expression using the current symbol values
   */
  private evaluateExpression(expression: string): number {
    try {
      // Replace symbolic expressions with numeric values
      let processedExpr = expression;

      // Handle common symbolic expressions
      processedExpr = processedExpr.replace(/√2/g, String(this.symbols['√2']));
      processedExpr = processedExpr.replace(/Sqrt\[2\]/g, String(this.symbols['Sqrt[2]']));
      processedExpr = processedExpr.replace(/R/g, String(this.symbols.R));
      processedExpr = processedExpr.replace(/P/g, String(this.symbols.P));

      // Handle expressions like "-R/√2"
      processedExpr = processedExpr.replace(/-R\/√2/g, String(-this.symbols.R / this.symbols['√2']));
      processedExpr = processedExpr.replace(/R\/√2/g, String(this.symbols.R / this.symbols['√2']));

      // If it's just a number, return it
      if (!isNaN(Number(processedExpr))) {
        return Number(processedExpr);
      }

      // Use mathjs to evaluate the expression
      return evaluate(processedExpr);
    } catch (error) {
      console.error(`Error evaluating expression "${expression}":`, error);
      return 0;
    }
  }

  /**
   * Parses points from XML data
   */
  private parsePoints(pointsData: any): Point[] {
    const points: Point[] = [];

    if (Array.isArray(pointsData)) {
      for (const pointData of pointsData) {
        points.push({
          name: pointData['@Name'] || '',
          x: this.evaluateExpression(pointData['@X'] || '0'),
          y: this.evaluateExpression(pointData['@Y'] || '0'),
        });
      }
    } else if (pointsData) {
      points.push({
        name: pointsData['@Name'] || '',
        x: this.evaluateExpression(pointsData['@X'] || '0'),
        y: this.evaluateExpression(pointsData['@Y'] || '0'),
      });
    }

    return points;
  }

  /**
   * Parses forces from XML data
   */
  private parseForces(forcesData: any): Force[] {
    const forces: Force[] = [];

    if (Array.isArray(forcesData)) {
      for (const forceData of forcesData) {
        forces.push({
          point: forceData['@Point'] || '',
          dir: forceData['@Dir'] as Force['dir'] || 'down',
          mag: this.evaluateExpression(forceData['@Mag'] || '0'),
          preset: true,
        });
      }
    } else if (forcesData) {
      forces.push({
        point: forcesData['@Point'] || '',
        dir: forcesData['@Dir'] as Force['dir'] || 'down',
        mag: this.evaluateExpression(forcesData['@Mag'] || '0'),
        preset: true,
      });
    }

    return forces;
  }

  /**
   * Parses rigid bodies from XML data
   */
  private parseRigidBodies(bodiesData: any): RigidBody[] {
    const bodies: RigidBody[] = [];

    if (Array.isArray(bodiesData)) {
      for (const bodyData of bodiesData) {
        bodies.push(this.parseRigidBody(bodyData));
      }
    } else if (bodiesData) {
      bodies.push(this.parseRigidBody(bodiesData));
    }

    return bodies;
  }

  private parseRigidBody(bodyData: any): RigidBody {
    return {
      name: bodyData['@Name'] || '',
      isGround: bodyData['@IsGround'] === 'True',
      image: bodyData.ImageFile || undefined,
      points: this.parsePoints(bodyData.Point),
      forces: this.parseForces(bodyData.ExternalForce),
    };
  }

  /**
   * Parses XML string into Problem data structure
   */
  parseXML(xmlString: string): Problem {
    try {
      const parsed = this.parser.parse(xmlString);
      const problemData = parsed.Problem;

      if (!problemData) {
        throw new Error('No Problem element found in XML');
      }

      const bodies = this.parseRigidBodies(problemData.RigidBody);

      const problemShapeData: ProblemShapeData = {
        bodies,
        symbols: this.symbols,
      };

      return {
        id: problemData['@id'] || '0',
        title: `Problem ${problemData['@id'] || '0'}`,
        description: 'Free-body diagram problem',
        data: problemShapeData,
      };
    } catch (error) {
      console.error('Error parsing XML:', error);
      throw new Error(`Failed to parse Problem XML: ${error}`);
    }
  }

  /**
   * Updates symbol values and re-evaluates all expressions
   */
  updateSymbols(newSymbols: Record<string, number>): void {
    this.symbols = { ...this.symbols, ...newSymbols };
  }
}

export const xmlParser = new ProblemXMLParser();