import { mkdir, writeFile } from 'node:fs/promises'
import { renderMermaid } from 'beautiful-mermaid'

const outDir = new URL('../docs/assets/diagrams/', import.meta.url)

const theme = {
  bg: '#fcf8f0',
  fg: '#2d2a26',
  line: '#a9783f',
  accent: '#e58224',
  muted: '#766c60',
  surface: '#f5f0e7',
  border: '#cbbca7',
  font: 'Inter, Noto Sans SC, system-ui, sans-serif',
}

const diagrams = {
  'two-primitives.zh': `graph LR
    S1[需求 Slot] --> R[Rule]
    S2[候选 Slot] --> R
    R --> S3[报告 Slot]`,
  'two-primitives.en': `graph LR
    S1[Request Slot] --> R[Rule]
    S2[Candidate Slot] --> R
    R --> S3[Report Slot]`,
  'reconcile.zh': `graph TB
    A[读取当前 Revision] --> B[寻找可推进的 Rule]
    B --> C[执行 Attempt]
    C --> D[原子提交输出]
    D --> E{目标已更新}
    E -->|否| A
    E -->|是| F[稳定]`,
  'reconcile.en': `graph TB
    A[Read current Revisions] --> B[Find eligible Rule]
    B --> C[Run Attempt]
    C --> D[Commit outputs atomically]
    D --> E{Target current}
    E -->|No| A
    E -->|Yes| F[Stable]`,
  'composition.zh': `graph TB
    I[输入] --> A[Rule A]
    I --> B[Rule B]
    A --> J[汇合 Rule]
    B --> J
    J --> O[输出]
    O -. 新 Revision .-> A`,
  'composition.en': `graph TB
    I[Input] --> A[Rule A]
    I --> B[Rule B]
    A --> J[Join Rule]
    B --> J
    J --> O[Output]
    O -. New Revision .-> A`,
  'pomodoro.zh': `graph TB
    B[brief] --> C[coder]
    K[candidate] --> C
    Q[critique] --> C
    C --> K
    K --> R[critic]
    B --> R
    Q --> R
    R --> Q
    K --> H[人工批准]
    Q --> H
    H --> A[approved]`,
  'pomodoro.en': `graph TB
    B[brief] --> C[coder]
    K[candidate] --> C
    Q[critique] --> C
    C --> K
    K --> R[critic]
    B --> R
    Q --> R
    R --> Q
    K --> H[human approval]
    Q --> H
    H --> A[approved]`,
  'learning.zh': `graph TB
    H[人工确认 scope] --> S[scope]
    S --> K[知识蒸馏]
    S --> E[例题蒸馏]
    S --> X[拓展蒸馏]
    K --> D[汇合 draft]
    E --> D
    X --> D
    D --> C[coverage]
    C --> W[handbook.docx]`,
  'learning.en': `graph TB
    H[Human confirms scope] --> S[scope]
    S --> K[Knowledge distillation]
    S --> E[Example distillation]
    S --> X[Expansion distillation]
    K --> D[Join draft]
    E --> D
    X --> D
    D --> C[Coverage review]
    C --> W[handbook.docx]`,
  'grill.zh': `graph TB
    G[goal] --> R[product_grill Shell Rule]
    D[grill_driver] --> R
    R --> T[多轮终端会话]
    T --> P[product_contract]
    T --> M[roadmap]`,
  'grill.en': `graph TB
    G[goal] --> R[product_grill Shell Rule]
    D[grill_driver] --> R
    R --> T[Multi-turn terminal session]
    T --> P[product_contract]
    T --> M[roadmap]`,
  'acquired.zh': `graph TB
    T[人工批准 topic] --> O[起源]
    T --> B[商业模式]
    T --> P[产品]
    T --> C[竞争]
    T --> L[领导层]
    T --> I[关键转折]
    C --> S[补充研究]
    O --> G[研究门]
    B --> G
    P --> G
    C --> G
    L --> G
    I --> G
    S --> G
    G --> M[制作会议]
    M --> A1[第一幕]
    M --> A2[第二幕]
    M --> A3[第三幕]
    A1 --> E[节目与 QA]
    A2 --> E
    A3 --> E`,
  'acquired.en': `graph TB
    T[Human-approved topic] --> O[Origins]
    T --> B[Business model]
    T --> P[Product]
    T --> C[Competition]
    T --> L[Leadership]
    T --> I[Inflections]
    C --> S[Supplement]
    O --> G[Research gate]
    B --> G
    P --> G
    C --> G
    L --> G
    I --> G
    S --> G
    G --> M[Production meeting]
    M --> A1[Act one]
    M --> A2[Act two]
    M --> A3[Act three]
    A1 --> E[Episode and QA]
    A2 --> E
    A3 --> E`,
  'harness.zh': `graph TB
    B[产品简述] --> G[Grill]
    G --> H1[人工定义]
    H1 --> F[风险评估]
    F --> H2[核心批准]
    H2 --> S[spec plan tasks]
    S --> R[角色检查]
    R --> W[Supervisor 与 worker]
    W --> E[eval report review]
    E --> C[Git Revision]`,
  'harness.en': `graph TB
    B[Product brief] --> G[Grill]
    G --> H1[Human definition]
    H1 --> F[Risk assessment]
    F --> H2[Core approval]
    H2 --> S[spec plan tasks]
    S --> R[Role check]
    R --> W[Supervisor and worker]
    W --> E[eval report review]
    E --> C[Git Revision]`,
  'cad.zh': `graph TB
    G0[G0 需求] --> G1[G1 源文件]
    G1 --> G2[G2 导出与仿真]
    G2 --> V[视觉 critic]
    G2 --> M[机械 critic]
    G2 --> C[CAD critic]
    V --> G4[G4 dossier]
    M --> G4
    C --> G4
    G4 --> G5[G5 技能基准]
    G5 --> G6[G6 人工发布]`,
  'cad.en': `graph TB
    G0[G0 Requirements] --> G1[G1 Source]
    G1 --> G2[G2 Export and simulate]
    G2 --> V[Visual critic]
    G2 --> M[Mechanical critic]
    G2 --> C[CAD critic]
    V --> G4[G4 Dossier]
    M --> G4
    C --> G4
    G4 --> G5[G5 Skill benchmark]
    G5 --> G6[G6 Human release]`,
  'graph-lab.zh': `graph TB
    S[串行] --> T[拓扑语义]
    P[并行与汇合] --> T
    C[条件门] --> T
    L[反馈循环] --> T
    R[失败与重试] --> T
    H[Human 与 Effect] --> T
    T --> E[确定性断言]`,
  'graph-lab.en': `graph TB
    S[Serial] --> T[Topology semantics]
    P[Parallel and join] --> T
    C[Conditional gate] --> T
    L[Feedback loop] --> T
    R[Failure and retry] --> T
    H[Human and Effect] --> T
    T --> E[Deterministic assertions]`,
}

await mkdir(outDir, { recursive: true })

for (const [name, source] of Object.entries(diagrams)) {
  const svg = await renderMermaid(source, theme)
  const cleaned = svg
    .replace(/@import url\([^)]*\);?/g, '')
    .replace(/[ \t]+$/gm, '')
  await writeFile(new URL(`${name}.svg`, outDir), cleaned)
}

console.log(`Rendered ${Object.keys(diagrams).length} coordinated diagrams.`)
