import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const path = join(process.cwd(), 'src/2024/en/5e-SRD-Monsters.json');
const monsters = JSON.parse(readFileSync(path, 'utf8')) as Array<Record<string, unknown>>;

describe('2024 monster data', () => {
  it('keeps the Mule stat block distinct from the Octopus', () => {
    const mule = monsters.find((monster) => monster.index === 'mule');
    expect(mule).toBeDefined();
    const actions = mule?.actions as Array<{ name: string }>;
    const abilities = mule?.special_abilities as Array<{ name: string }>;
    expect(actions.map((action) => action.name)).toEqual(['Hooves']);
    expect(mule?.reactions).toEqual([]);
    expect(abilities.map((ability) => ability.name)).toEqual(['Beast of Burden']);
  });
});
