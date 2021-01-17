export type Plan = {
  id: string
  priceId?: string
  playerCount: number
  cost: number
  offered: boolean
  childPlan?: Plan
  features: string[]
}

const buildFeatures = (playerCount) => [
  `Allows up to ${playerCount} players!`,
  `Free updates to major & minor versions for 1 year!`,
  `Access to Airplane Dashboard for 1 year!`,
  `Unlimited to access to your builds forever!`,
  `Free support in Discord!`,
]

const plans: Plan[] = [
  {
    id: "100plan",
    priceId: "price_1HtwF2DsSZ0J0xxxvY4yZS2F",
    playerCount: 100,
    cost: 400,
    offered: true,
    childPlan: {
      id: "100plan_child",
      playerCount: 10,
      cost: 0,
      offered: false,
      features: [],
    },
    features: [
      ...buildFeatures(100),
      "Free 2nd copy of Airplane with 10 player limit for testing!",
    ],
  },
  {
    id: "200plan",
    priceId: "price_1Hu0NcDsSZ0J0xxxtShuxMem",
    playerCount: 200,
    cost: 600,
    offered: true,
    features: [
      ...buildFeatures(200),
      "Free 2nd copy of Airplane with 15 player limit for testing!",
    ],
  },
  {
    id: "300plan",
    playerCount: 300,
    priceId: "price_1Hu0NpDsSZ0J0xxxG28edNgH",
    cost: 800,
    offered: true,
    features: [
      ...buildFeatures(300),
      "Free 2nd copy of Airplane with 20 player limit for testing!",
    ],
  },
  {
    id: "500plan",
    priceId: "price_1Hu0OCDsSZ0J0xxxxx2zIa1e",
    playerCount: 500,
    cost: 1000,
    offered: true,
    features: [
      ...buildFeatures(500),
      "Free 2nd copy of Airplane with 25 player limit for testing!",
    ],
  },
]

const plansById = {}
for (const plan of plans) {
  plansById[plan.id] = plan
}

export function matchPlan(plan: Plan): Plan | undefined {
  return plansById[plan.id]
}

export default plans
