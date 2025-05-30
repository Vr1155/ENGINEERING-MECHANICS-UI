import { Problem } from '../types/problem';
import { xmlParser } from './xmlParser';

// For now, we'll embed the XML content directly since React Native asset loading is complex
const PROBLEM_6_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Problem id="6">
  <RigidBody Name="AC" IsGround="False">
    <ImageFile>assets/AC.png</ImageFile>
    <Point Name="A" X="-R" Y="0" />
    <Point Name="mid" X="-R/√2" Y="R/√2" />
    <Point Name="C" X="0" Y="R" />
    <ExternalForce Point="mid" Dir="down" Mag="P" />
  </RigidBody>
  <RigidBody Name="CB" IsGround="False">
    <ImageFile>assets/CB.png</ImageFile>
    <Point Name="C" X="0" Y="R" />
    <Point Name="mid" X="R/√2" Y="R/√2" />
    <Point Name="B" X="R" Y="0" />
    <ExternalForce Point="mid" Dir="down" Mag="P" />
  </RigidBody>
  <RigidBody Name="A_Ground" IsGround="True">
    <Point Name="A" X="-R" Y="0" />
  </RigidBody>
  <RigidBody Name="B_Ground" IsGround="True">
    <Point Name="B" X="R" Y="0" />
  </RigidBody>
</Problem>`;

export class ProblemDataLoader {
  private static instance: ProblemDataLoader;
  private problems: Map<string, Problem> = new Map();

  private constructor() {
    this.loadProblems();
  }

  public static getInstance(): ProblemDataLoader {
    if (!ProblemDataLoader.instance) {
      ProblemDataLoader.instance = new ProblemDataLoader();
    }
    return ProblemDataLoader.instance;
  }

  private loadProblems(): void {
    try {
      // Load Problem #6
      const problem6 = xmlParser.parseXML(PROBLEM_6_XML);
      problem6.title = "Problem #6: Quarter-Circle Rigid Bodies";
      problem6.description = "Two quarter-circle rigid bodies AC and CB with downward loads P at their mid-points. Draw the free-body diagram showing all forces and reactions.";

      this.problems.set('6', problem6);

      console.log('Problem #6 loaded successfully:', problem6);
    } catch (error) {
      console.error('Error loading problems:', error);
    }
  }

  public getProblem(id: string): Problem | null {
    return this.problems.get(id) || null;
  }

  public getAllProblems(): Problem[] {
    return Array.from(this.problems.values());
  }

  public updateProblemSymbols(problemId: string, symbols: Record<string, number>): Problem | null {
    const problem = this.problems.get(problemId);
    if (!problem) return null;

    // Update the parser symbols and re-parse the problem
    xmlParser.updateSymbols(symbols);

    if (problemId === '6') {
      const updatedProblem = xmlParser.parseXML(PROBLEM_6_XML);
      updatedProblem.title = problem.title;
      updatedProblem.description = problem.description;
      this.problems.set(problemId, updatedProblem);
      return updatedProblem;
    }

    return problem;
  }
}

export const problemDataLoader = ProblemDataLoader.getInstance();