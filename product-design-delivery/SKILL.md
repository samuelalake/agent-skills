---
name: product-design-delivery
description: Shape, explore, approve, hand off, or review a user-facing product change against the adopting product's real design system. Use when work needs a design decision, an existing design must be reproduced faithfully, or Builder needs an approved interaction and visual contract before implementation. Do not use for purely internal changes with no user-facing behavior.
---

# Product design delivery

Move a user-facing change from intent to an approved, implementable design
without inventing product direction or treating implementation output as its
own specification.

The adopting product owns its design system, platform conventions, artifact
locations, approval authority, and verification tools. Discover and follow
that local context. This skill supplies the decision process and handoff
contract, not a universal visual style.

## Establish the authority

Before proposing a design, inspect the current product and the sources the
repository identifies as authoritative. These may include shipped behavior,
Figma, Claude Design, an Origami or motion prototype, screenshots, component
catalogs, design tokens, code, decision records, and prior user feedback.

Name the authority in the task. When sources disagree, do not silently choose
one. Surface the conflict and identify the decision needed.

Do not infer that an artifact is approved, current, shipped, or canonical from
its existence. Preserve the distinction between a concept, prototype,
reconstruction, approved design, implemented change, and verified release.

## Classify the work

Choose the mode that best describes the requested outcome:

- **Reproduce:** an authoritative design already exists. Preserve its
  composition and behavior; do not redesign it under the guise of improvement.
- **Extend:** add a state or flow by reusing established components and
  conventions. Prefer existing product grammar over a novel direction.
- **Design:** resolve a new product or interaction decision. Explore enough
  alternatives to expose the meaningful tradeoff, then converge.
- **Systemize:** create or change a reusable component, token, or pattern.
  Evaluate its family of states and downstream consumers, not only the first
  screen that needs it.

A task may move from Design to Systemize, but avoid expanding a bounded
Reproduce or Extend request without approval.

## Decide whether design is blocking Build

Design work is required before Build when an unresolved choice would
materially change layout, interaction, product behavior, content hierarchy,
or a reusable system rule.

Design work is not automatically required when:

- the authoritative artifact already specifies the requested behavior;
- the change is a faithful implementation or repair;
- the product gives Builder explicit, bounded design latitude; or
- the decision is an ordinary application of an established component.

When design is required, keep the item out of the build-ready queue until the
design authority approves the design contract. An agent may recommend a
direction but must not approve its own proposal. Design approval does not by
itself authorize unrelated implementation, publication, or release actions.

## Explore at the right fidelity

Start with the cheapest artifact that can answer the open question. Use flows
or wireframes for structure, interactive prototypes for behavior, and
high-fidelity compositions for visual decisions. Do not polish a direction
whose product logic is still unsettled.

When alternatives are useful, make them meaningfully different and explain
the tradeoff each tests. Stop generating options after a direction is chosen.
Carry the approved decisions forward instead of restarting from a blank canvas.

Keep distinct review passes when that improves judgment:

- product outcome and information hierarchy;
- layout, grouping, spacing, and responsive behavior;
- interaction, motion, and state transitions;
- content and voice;
- visual finish and system consistency.

Show the artifact before implementation at the decisions where visual or
interaction judgment matters. A textual description alone is not design
approval when the decision is inherently visual.

## Use the product's system

Reuse real components, tokens, assets, platform behavior, and naming. Inspect
their implemented states rather than relying only on a catalog thumbnail.
Account for relevant empty, loading, error, success, disabled, selected,
permission, interruption, and recovery states.

Before drawing a new screen element, inventory the product's canonical
components and try to compose the result from their existing variants and
slots. If the system is missing a necessary state or slot, prefer a coherent
extension of the owning component family and then use its instance. A local
custom construction is a last resort, and a hand-drawn imitation of an
existing component is not an acceptable final artifact. Preserve already
approved screen structure while extending it; do not rebuild unrelated areas
from scratch.

Treat motion as behavior: specify trigger, transition, continuity, completion,
interruption, and reduced-motion behavior where relevant. Treat accessibility
and platform conventions as part of the design rather than post-build cleanup.

When the same surface appears in multiple screens, represent its meaningful
states in the owning component family instead of assembling each occurrence
independently. Update the component first, then use its instances so icons,
menus, dividers, spacing, and interaction roles stay consistent across every
consumer. A screen that resembles code visually is not Aligned when its
component anatomy, available actions, or interaction semantics differ from the
reachable implementation; mark it Proposed or Review until reconciled.

For settings-style products, separate the scrolling container from the
sections it contains. The platform settings list owns the viewport background,
body inset, scrolling, and spacing between sections. A Section owns only its
header, rows, footer, fill, and internal dividers. A single-row section still
uses Section and has no internal divider. Do not encode inter-section spacing
as a Section variant when it belongs to the parent list or stack.

For destructive sheets or overlays, verify the presented state and the content
behind it. The underlying screen must preserve the intended scroll position,
the action must remain reachable at supported heights and text sizes, and the
overlay must not create a second non-scrolling reconstruction of the body.

Name permissions for the authority they actually grant. Distinguish protocol
or operator scopes, product capabilities, and operating-system data
permissions. Do not present a technical Read or Write scope as blanket access
to user data unless the runtime contract establishes that meaning.

Choose tools by the durable outcome:

- use a fast design canvas or interactive prototype to explore and gain
  alignment;
- use the product's canonical design tool for lasting system decisions and
  editable product artifacts;
- use the supplied source artifact for fidelity work;
- use code as the design medium when it is the clearest faithful expression of
  the interaction.

Do not translate an approved artifact into another tool merely to satisfy a
preferred workflow. Record where the authoritative result lives.

## Map screen topology without obscuring the screens

Keep canonical editable screens and their component structure in the
product's design file. When a multi-screen flow becomes difficult to read
because connectors compete with the screen compositions, move the navigation
topology to FigJam while keeping the design file as the visual source of
truth.

Treat this as one canonical source and one synchronized projection, not two
equal design authorities. Figma Design owns screen composition and component
masters; FigJam owns route topology, connector labels, and flow grouping.
Changes to a main component flow from Design to its linked FigJam instances.
A change made directly to a FigJam instance is an override or proposal until
it is deliberately promoted back into the canonical Design component. If a
Figma-side flow presentation is also useful, compose it from the same
canonical instances rather than round-tripping the entire FigJam board into a
second independently editable screen set.

The FigJam map must use the actual canonical screen for every referenced
state. Prefer copying editable component instances from Figma Design so layers,
component relationships, and overrides remain available in FigJam and the
same element can move back to Design. Use raster renders only when editable
transfer is unavailable or when the image is intentionally evidence rather
than a working design artifact. Abstract boxes may appear only as an optional
compact overview or legend; they do not replace the screen map. Use native,
visibly labeled connectors. When one source fans out to multiple destinations,
route the connections through a shared branch spine, then keep each
destination's local flow close to that screen. Cluster related routes by
product domain and show each screen's lifecycle status, such as Aligned,
Proposed, Review, or Deprecated.

Keep the screen's own viewport background and safe-area chrome intact; blank
space inside that viewport is part of the screen, not a FigJam wrapper to
remove. Scale every screen with one uniform proportional scale and verify the
resulting dimensions after paste or component resolution. Do not use ordinary
resize behavior that reflows the internal layout merely to make the topology
smaller.

Render and visually inspect the completed topology. Check that screen labels,
status labels, connector labels, source-to-destination direction, branch
spines, and local grouping remain legible at normal review zoom.

Derive screen status from evidence. Trace the current reachable navigation and
state graph before labeling a screen: use Aligned only for a composition that
matches reachable code and canonical components, Proposed for a deliberate new
direction, Review when evidence conflicts or is incomplete, and Deprecated for
an intentionally retained obsolete state. Pair each topology screen with a
short source note naming the current implementation file or explaining that it
spans several files or has no implementation yet.

## Produce a design-ready task

Before handoff, create or validate the packet in
[references/design-ready-task.md](references/design-ready-task.md). Keep it in
the project's configured source of truth and link rather than duplicate large
artifacts.

The packet must make clear:

- the user outcome and bounded scope;
- the work mode and authoritative references;
- the approved composition, behavior, and relevant states;
- existing system elements to reuse;
- what must be exact, what Builder may adapt, and what is excluded;
- implementation constraints already known;
- the evidence required to judge the delivered result;
- approval state and any remaining human decision.

If a material decision remains open, return the item to design rather than
writing acceptance criteria that conceal the ambiguity.

## Handoff and review

Builder implements the approved contract and may surface constraints or
propose a bounded amendment. Builder must not silently substitute a different
product decision. Record approved amendments in the task so Reviewer judges
the current contract rather than an obsolete artifact.

Bind delivery evidence to the exact version under review. Use the correct
device, viewport, content, and environment. Screenshots prove states;
recordings prove transitions and interaction. Prefer a compact set that shows
the requested behavior over repeated or unrelated media.

Review both system consistency and perceptual fidelity. Metrics, snapshots,
tests, and successful builds are evidence, not substitutes for visual judgment.
When a material mismatch remains, describe it concretely and return it to
Builder or Design according to whether the cause is implementation or an
unresolved product decision.

## Preserve project control

Keep observations and alternatives in the project's intake or design view.
Promote only approved, bounded work into the executable issue queue. Update an
existing concern when possible instead of creating a new issue for every
comment or iteration.

Do not broaden scope, create external artifacts, publish designs, dispatch
Builder, or mark design approved unless the current task and project authority
permit that action.
