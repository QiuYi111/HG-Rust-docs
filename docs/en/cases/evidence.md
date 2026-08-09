<div class="language-switch"><a href="../../zh/cases/evidence/">中文</a> · <strong>English</strong></div>

# Run evidence

All four tutorial workflows have been run. This page comes after the tutorials so you can learn how to build each flow before looking at how it behaved under change, failure, and recovery.

## What each case proves

| Case | What the run checks | Observed result |
|---|---|---|
| Learning Helper | Separate source distillations, a real Word equation, readable rendering, and unchanged sibling branches after an Expansion-only edit | Baseline 10 Attempts, unchanged rerun 10, one-source change 15. Five live runs took 33.910–46.635 seconds |
| Acquired Podcast | Six constrained research paths, supplemental research, three acts, two production sheets, and cancel/resume | Initial concurrency ceiling 3 with observed overlap of 3. All five live runs preserved the six research results completed before cancellation; 45.056–69.804 seconds |
| Harness Lifecycle | Stale answer rejection, the case role check rejecting an out-of-scope request, one Supervisor/worker iteration, and a Git evidence package | All five live runs completed one iteration, with 14 baseline Attempts and one Git evidence-package commit; 55.498–88.272 seconds |
| CAD Release | KiCad, ngspice, LibreOffice, three limited checks, local presentation repair, and the G6 response gate | All five live runs kept 11 upstream results unchanged; 18.572–32.619 seconds |

## Shared kernel checks

Independent kernel regression tests and the case pressure runs together exercised the foundations underneath them. This does not mean that every case independently covers every detail below.

- Child stdout and stderr are drained together, so long output does not block a run.
- Cancellation and timeout end the whole Unix process group instead of leaving descendants behind.
- Failed work can be retried without overwriting a result that was already accepted.
- A cancelled run releases its old lease so a new run does not wait for expiry.
- Files, directories, and Git projects are versioned by content and can be restored after workspace edits.
- When explicit network restrictions are enabled, unapproved hosts, redirects, and private-address resolutions are denied.
- Each case run emits a report checked against `hg.real-world-report/v1`.

The complete HG-Rust verification commands are:

```bash
make verify
make verify-ai
```

The release run passed the product suite and all 65 Harness checks. Case report files were generated in temporary run directories. The site keeps this summary and the reproduction steps; it does not present temporary files as archived standalone reports.

## How to read the numbers

Five runs are an observed sample. They show that the workflows ran; they are not a long-term performance promise. Formal duration, token, and cost budgets need a separate calibration campaign. The CAD case also proves delivery workflow and evidence lineage, not manufacturing, electrical, mechanical, or safety certification.

## Reproduce the cases

The complete configurations, pinned inputs, and runners are in the [HG-Rust real-world directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world). Run the contract profile first, then use the live profile when the required local tools are available.
