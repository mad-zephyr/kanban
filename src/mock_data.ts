import { ServerBoard } from './common/models/board-model/ui-board-model'

const ownerId = 'guest_user'

const serverMock: ServerBoard[] = [
  {
    name: 'Platform Launch',
    ownerId,
    statuses: [
      {
        name: 'Todo',
        tasks: [
          {
            name: 'Build UI for onboarding flow',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                name: 'Sign up page',
                done: true,
              },
              {
                name: 'Sign in page',
                done: false,
              },
              {
                name: 'Welcome page',
                done: false,
              },
            ],
          },
          {
            name: 'Build UI for search',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                name: 'Search page',
                done: false,
              },
            ],
          },
          {
            name: 'Build settings UI',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                name: 'Account page',
                done: false,
              },
              {
                name: 'Billing page',
                done: false,
              },
            ],
          },
          {
            name: 'QA and test all major user journeys',
            description:
              'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
            status: 'Todo',
            subtasks: [
              {
                name: 'Internal testing',
                done: false,
              },
              {
                name: 'External testing',
                done: false,
              },
            ],
          },
        ],
      },
      {
        name: 'Doing',
        tasks: [
          {
            name: 'Design settings and search pages',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                name: 'Settings - Account page',
                done: true,
              },
              {
                name: 'Settings - Billing page',
                done: true,
              },
              {
                name: 'Search page',
                done: false,
              },
            ],
          },
          {
            name: 'Add account management endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                name: 'Upgrade plan',
                done: true,
              },
              {
                name: 'Cancel plan',
                done: true,
              },
              {
                name: 'Update payment method',
                done: false,
              },
            ],
          },
          {
            name: 'Design onboarding flow',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                name: 'Sign up page',
                done: true,
              },
              {
                name: 'Sign in page',
                done: false,
              },
              {
                name: 'Welcome page',
                done: false,
              },
            ],
          },
          {
            name: 'Add search enpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                name: 'Add search endpoint',
                done: true,
              },
              {
                name: 'Define search filters',
                done: false,
              },
            ],
          },
          {
            name: 'Add authentication endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                name: 'Define user model',
                done: true,
              },
              {
                name: 'Add auth endpoints',
                done: false,
              },
            ],
          },
          {
            name: 'Research pricing points of various competitors and trial different business models',
            description:
              "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
            status: 'Doing',
            subtasks: [
              {
                name: 'Research competitor pricing and business models',
                done: true,
              },
              {
                name: 'Outline a business model that works for our solution',
                done: false,
              },
              {
                name: 'Talk to potential customers about our proposed solution and ask for fair price expectancy',
                done: false,
              },
            ],
          },
        ],
      },
      {
        name: 'Done',
        tasks: [
          {
            name: 'Conduct 5 wireframe tests',
            description:
              'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
            status: 'Done',
            subtasks: [
              {
                name: 'Complete 5 wireframe prototype tests',
                done: true,
              },
            ],
          },
          {
            name: 'Create wireframe prototype',
            description:
              'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',
            status: 'Done',
            subtasks: [
              {
                name: 'Create clickable wireframe prototype in Balsamiq',
                done: true,
              },
            ],
          },
          {
            name: 'Review results of usability tests and iterate',
            description:
              "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
            status: 'Done',
            subtasks: [
              {
                name: 'Meet to review notes from previous tests and plan changes',
                done: true,
              },
              {
                name: 'Make changes to paper prototypes',
                done: true,
              },
              {
                name: 'Conduct 5 usability tests',
                done: true,
              },
            ],
          },
          {
            name: 'Create paper prototypes and conduct 10 usability tests with potential customers',
            description: '',
            status: 'Done',
            subtasks: [
              {
                name: 'Create paper prototypes for version one',
                done: true,
              },
              {
                name: 'Complete 10 usability tests',
                done: true,
              },
            ],
          },
          {
            name: 'Market discovery',
            description:
              'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.',
            status: 'Done',
            subtasks: [
              {
                name: 'Interview 10 prospective customers',
                done: true,
              },
            ],
          },
          {
            name: 'Competitor analysis',
            description: '',
            status: 'Done',
            subtasks: [
              {
                name: 'Find direct and indirect competitors',
                done: true,
              },
              {
                name: 'SWOT analysis for each competitor',
                done: true,
              },
            ],
          },
          {
            name: 'Research the market',
            description:
              'We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.',
            status: 'Done',
            subtasks: [
              {
                name: 'Write up research analysis',
                done: true,
              },
              {
                name: 'Calculate TAM',
                done: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Marketing Plan',
    ownerId,
    statuses: [
      {
        name: 'Todo',
        tasks: [
          {
            name: 'Plan Product Hunt launch',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                name: 'Find hunter',
                done: false,
              },
              {
                name: 'Gather assets',
                done: false,
              },
              {
                name: 'Draft product page',
                done: false,
              },
              {
                name: 'Notify customers',
                done: false,
              },
              {
                name: 'Notify network',
                done: false,
              },
              {
                name: 'Launch!',
                done: false,
              },
            ],
          },
          {
            name: 'Share on Show HN',
            description: '',
            status: '',
            subtasks: [
              {
                name: 'Draft out HN post',
                done: false,
              },
              {
                name: 'Get feedback and refine',
                done: false,
              },
              {
                name: 'Publish post',
                done: false,
              },
            ],
          },
          {
            name: 'Write launch article to publish on multiple channels',
            description: '',
            status: '',
            subtasks: [
              {
                name: 'Write article',
                done: false,
              },
              {
                name: 'Publish on LinkedIn',
                done: false,
              },
              {
                name: 'Publish on Inndie Hackers',
                done: false,
              },
              {
                name: 'Publish on Medium',
                done: false,
              },
            ],
          },
        ],
      },
      {
        name: 'Doing',
        tasks: [],
      },
      {
        name: 'Done',
        tasks: [],
      },
    ],
  },
  {
    name: 'Roadmap',
    ownerId,
    statuses: [
      {
        name: 'Now',
        tasks: [
          {
            name: 'Launch version one',
            description: '',
            status: '',
            subtasks: [
              {
                name: 'Launch privately to our waitlist',
                done: false,
              },
              {
                name: 'Launch publicly on PH, HN, etc.',
                done: false,
              },
            ],
          },
          {
            name: 'Review early feedback and plan next steps for roadmap',
            description:
              "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",
            status: '',
            subtasks: [
              {
                name: 'Interview 10 customers',
                done: false,
              },
              {
                name: 'Review common customer pain points and suggestions',
                done: false,
              },
              {
                name: 'Outline next steps for our roadmap',
                done: false,
              },
            ],
          },
        ],
      },
      {
        name: 'Next',
        tasks: [],
      },
      {
        name: 'Later',
        tasks: [],
      },
    ],
  },
]

export { serverMock }
