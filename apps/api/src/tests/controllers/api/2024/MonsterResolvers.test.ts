import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  Monster2024Resolver,
  MonsterAction2024Resolver,
  MonsterArmorClass2024Resolver
} from '@/graphql/2024/resolvers/monster/resolver'
import ConditionModel from '@/models/2024/condition'
import EquipmentModel from '@/models/2024/equipment'
import { Monster2024, MonsterAction2024, MonsterArmorClass2024 } from '@/models/2024/monster'

vi.mock('@/models/2024/equipment', () => ({ default: { find: vi.fn() } }))
vi.mock('@/models/2024/condition', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/models/2024/condition')>()),
  default: { find: vi.fn() }
}))

const armorRef = {
  index: 'chain-shirt',
  name: 'Chain Shirt',
  url: '/api/2024/equipment/chain-shirt'
}

describe('MonsterArmorClass2024Resolver.armor', () => {
  beforeEach(() => vi.clearAllMocks())

  it('resolves armor references through EquipmentModel', async () => {
    const equipment = [{ index: 'chain-shirt', name: 'Chain Shirt' }]
    vi.mocked(EquipmentModel.find).mockReturnValue({
      lean: () => Promise.resolve(equipment)
    } as any)

    const ac = { value: 16, armor: [armorRef] } as MonsterArmorClass2024
    const result = await new MonsterArmorClass2024Resolver().armor(ac)

    expect(EquipmentModel.find).toHaveBeenCalledWith({ index: { $in: ['chain-shirt'] } })
    expect(result).toEqual(equipment)
  })

  it('returns [] when there is no armor', async () => {
    const result = await new MonsterArmorClass2024Resolver().armor({
      value: 17
    } as MonsterArmorClass2024)
    expect(result).toEqual([])
    expect(EquipmentModel.find).not.toHaveBeenCalled()
  })
})

describe('Monster2024Resolver.condition_immunities', () => {
  beforeEach(() => vi.clearAllMocks())

  it('attaches each reference\'s own note to its resolved condition, in order', async () => {
    const conditions = [
      { index: 'frightened', name: 'Frightened' },
      { index: 'charmed', name: 'Charmed' }
    ]
    vi.mocked(ConditionModel.find).mockReturnValue({
      lean: () => Promise.resolve(conditions)
    } as any)

    const monster = {
      condition_immunities: [
        { index: 'charmed', name: 'Charmed', url: '/api/2024/conditions/charmed', note: 'with Mind Blank' },
        { index: 'frightened', name: 'Frightened', url: '/api/2024/conditions/frightened' }
      ]
    } as Monster2024

    const result = await new Monster2024Resolver().condition_immunities(monster)

    expect(result).toEqual([
      { condition: { index: 'charmed', name: 'Charmed' }, note: 'with Mind Blank' },
      { condition: { index: 'frightened', name: 'Frightened' }, note: undefined }
    ])
  })

  it('drops a reference whose condition was not found', async () => {
    vi.mocked(ConditionModel.find).mockReturnValue({ lean: () => Promise.resolve([]) } as any)

    const monster = {
      condition_immunities: [{ index: 'made-up', name: 'Made Up', url: '/api/2024/conditions/made-up' }]
    } as Monster2024

    expect(await new Monster2024Resolver().condition_immunities(monster)).toEqual([])
  })
})

describe('MonsterAction2024Resolver.action_options', () => {
  const resolver = new MonsterAction2024Resolver()
  const build = (options: unknown[], choose = 3, desc?: string) =>
    ({
      action_options: {
        choose,
        desc,
        type: 'action',
        from: { option_set_type: 'options_array', options }
      }
    }) as unknown as MonsterAction2024

  it('round-trips choose > 1 with action options and no desc', async () => {
    const result = await resolver.action_options(
      build([
        { option_type: 'action', action_name: 'Claw', count: 3, type: 'melee' },
        { option_type: 'action', action_name: 'Tail', count: 3, type: 'melee' }
      ])
    )
    expect(result?.choose).toBe(3)
    expect(result?.desc).toBeUndefined()
    expect((result?.from as any).options).toEqual([
      { option_type: 'action', action_name: 'Claw', count: 3, type: 'melee' },
      { option_type: 'action', action_name: 'Tail', count: 3, type: 'melee' }
    ])
  })

  it('passes desc and multiple options through', async () => {
    const items = [
      { option_type: 'action', action_name: 'Bite', count: 1, type: 'melee' },
      { option_type: 'action', action_name: 'Roar', count: '2', type: 'special' }
    ]
    const result = await resolver.action_options(
      build([{ option_type: 'multiple', items }], 1, 'Any combination')
    )
    expect(result?.desc).toBe('Any combination')
    expect((result?.from as any).options[0]).toEqual({
      option_type: 'multiple',
      items: [
        { option_type: 'action', action_name: 'Bite', count: 1, type: 'melee' },
        { option_type: 'action', action_name: 'Roar', count: 2, type: 'special' }
      ]
    })
  })

  it('coerces a non-numeric count to 0 instead of throwing', async () => {
    const result = await resolver.action_options(
      build([
        { option_type: 'action', action_name: 'Head', count: 'Number of Heads', type: 'melee' }
      ])
    )
    expect((result?.from as any).options[0].count).toBe(0)
  })
})
