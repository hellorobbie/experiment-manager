# Next Steps - Phase 2: Experiment Creation Flow

## What We Just Built (Phase 1) ✅

You now have a fully scaffolded experiment management platform with:

- Authentication (login page with demo credentials)
- Database schema for Users, Experiments, Variants, and AuditLogs
- List view showing all experiments
- Proper folder structure following Next.js best practices
- Type-safe validation logic with Zod
- Audit logging infrastructure

## What's Next: Phase 2 - Creation Flow

The next phase focuses on building the experiment creation wizard. This is where the app gets interesting because you'll implement:

### 1. Multi-Step Form Component

Create a wizard that guides users through:
- **Step 1**: Basic Info (name, description, hypothesis)
- **Step 2**: Variants (add/remove, set traffic %)
- **Step 3**: Targeting Rules (device, country, channel)
- **Step 4**: Select Primary KPI
- **Step 5**: Review & Save

**Key files to create:**
- `app/(dashboard)/experiments/new/page.tsx` - Main wizard page
- `components/experiments/ExperimentWizard.tsx` - Wizard container
- `components/experiments/VariantEditor.tsx` - Traffic allocation UI
- `components/experiments/TargetingBuilder.tsx` - Targeting form
- `app/api/experiments/route.ts` - POST endpoint

### 2. Traffic Allocation UI

Build an interface where users can:
- Add/remove variants dynamically
- Adjust traffic percentages with sliders
- See real-time validation (must sum to 100%)
- Mark one variant as "Control"

**Implementation tips:**
- Use React state to track variants array
- Calculate total traffic on every change
- Show error if total !== 100%
- Disable "Next" button until valid

### 3. Targeting Rule Builder

Create dropdown-based selectors for:
- **Device**: desktop, mobile, tablet
- **Country**: US, CA, UK, etc.
- **Channel**: organic, paid, email, social

**Data structure:**
```typescript
{
  device: ["desktop", "mobile"],
  country: ["US"],
  channel: ["organic"]
}
```

Store as stringified JSON in the database.

### 4. API Route for Creating Experiments

Build `POST /api/experiments`:
- Validate request body with Zod
- Create experiment + variants in a transaction
- Create audit log entry
- Return created experiment ID

**Example implementation:**
```typescript
// app/api/experiments/route.ts
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const validated = experimentSchema.parse(body);

  const experiment = await prisma.experiment.create({
    data: {
      ...validated,
      ownerId: session.user.id,
      targeting: JSON.stringify(validated.targeting),
      variants: {
        create: validated.variants,
      },
    },
    include: { variants: true },
  });

  await createAuditLog({
    action: "created",
    experimentId: experiment.id,
    userId: session.user.id,
  });

  return Response.json(experiment);
}
```

### 5. Form State Management

You have two options:

**Option A: Simple useState (recommended for MVP)**
```typescript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  name: "",
  variants: [{ name: "Control", traffic: 50 }],
  targeting: {},
  primaryKPI: "",
});
```

**Option B: React Hook Form + Zod**
More robust but adds complexity. Save for Phase 5 if needed.

## Suggested Order of Implementation

1. Create the basic wizard shell with step navigation
2. Build Step 1 (basic info form)
3. Build Step 2 (variant editor with traffic allocation)
4. Add client-side validation for traffic splits
5. Build Step 3 (targeting rules)
6. Build Step 4 (KPI selector)
7. Build Step 5 (review screen)
8. Create the API endpoint
9. Wire up form submission
10. Add redirect to experiment detail page on success

## Testing Strategy

After each step, test:
- Can you navigate forward/backward?
- Does validation block progression when invalid?
- Is form data preserved when navigating between steps?
- Does the final submission create the experiment in the database?

## Common Pitfalls to Avoid

### 1. Over-engineering the traffic allocator
Don't build a fancy drag-and-drop UI. Simple number inputs or sliders are fine.

### 2. Premature optimization
Don't build "save draft" with auto-save. Just save on final submit for MVP.

### 3. Complex targeting logic
Stick to the 3 dimensions (device, country, channel). Don't build a visual query builder.

### 4. Skipping validation
The go-live validation in Phase 3 depends on proper data. Make sure traffic always sums to 100%.

## UI Inspiration

For the variant editor, think:
```
Variant 1: Control
[Text input] [50%] [Remove]

Variant 2: Treatment A
[Text input] [50%] [Remove]

[+ Add Variant]

Total: 100% ✓
```

For targeting:
```
Device: [x] Desktop [x] Mobile [ ] Tablet
Country: [Dropdown: US, CA, UK...]
Channel: [x] Organic [ ] Paid
```

## When You're Done

You'll have a working creation flow that:
- Guides users through a multi-step process
- Enforces client-side validation
- Saves experiments to the database
- Creates audit logs automatically
- Redirects to the experiment detail page

Then move to Phase 3 to build the detail page and implement the state machine for going live.

---

**Ready to start?** Begin with creating the wizard shell in `app/(dashboard)/experiments/new/page.tsx`.
