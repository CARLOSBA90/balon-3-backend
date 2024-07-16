import { FixtureInterface } from "./fixture.interface";

export interface CardInterface {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    fixture: FixtureInterface;

  }
  