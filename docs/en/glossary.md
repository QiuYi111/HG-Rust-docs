<div class="language-switch"><a href="../../zh/glossary/">中文</a> · <strong>English</strong></div>

# Glossary

| Term | Definition |
|---|---|
| Artifact | A readable, verifiable, versioned result such as a file, directory, Git tree, stream, or opaque value |
| Slot | A stable name and desired position for an Artifact |
| Rule | A declared transformation from input Slots to output Slots |
| Revision | An immutable Artifact state |
| Head | The Revision currently accepted for a Slot |
| Activation | A Rule, exact input vector, and execution contract treated as one coordination unit |
| Attempt | One actual execution try for an Activation |
| Receipt | A terminal record proving success or `NO_CHANGE` |
| Session | An execution identity that can span multiple steps |
| Guard | A predicate evaluated before a Rule can run |
| Effect | An action that changes an external system |
| Materialization | Restoring a Head to its declared path |
| Drift | A mismatch between materialized files and the Head |
| Lease | Short-lived execution ownership used to protect concurrent commits |
| Event | An append-only record of a state change |
| Fixed point | A stable state in which targets and their input closure are fresh |

## State words

- **Fresh**: the current Slot Head agrees with an effective Receipt.
- **Stale**: a result exists, but current inputs or rules require reassessment.
- **Blocked**: a required input is missing, so execution cannot proceed safely.
- **Suppressed**: a Guard returned FALSE and the current execution is quiet.
- **Failed**: the most recent Attempt failed and needs inspection.
- **NO_CHANGE**: execution confirmed that no new result was needed, with a Receipt left behind.
