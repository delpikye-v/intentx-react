## ⚛️⚡ intentx-react

[![NPM](https://img.shields.io/npm/v/intentx-react.svg)](https://www.npmjs.com/package/intentx-react) ![Downloads](https://img.shields.io/npm/dt/intentx-react.svg)

<a href="https://codesandbox.io/p/sandbox/7tgzxw" target="_blank">LIVE EXAMPLE</a>

`intentx-react` is an architectural layer for react.

It enforces a strict separation between:

- Business Logic (deterministic runtime)
- UI Rendering (fine-grained reactivity)

> It is a bridge between deterministic logic and React’s reactive UI.

---

## ✨ Why intentx-react?

`intentx-react` is a thin React binding on top of that runtime.

Use it when your UI starts to feel like business logic.

✅ Complex async workflows  
✅ Intent-based architecture  
✅ Microfrontend communication  
✅ Testable business logic  
✅ Cross-framework runtime reuse  

React is optional.

---

## 🧠  Mental Model

```txt
UI / HTTP / Queue / Cron
        ↓
  intentx-runtime
        ↓
Fine-grained reactivity updates UI
```

Core principle:

> Intent is the only mutation entry point.
> The [runtime](https://www.npmjs.com/package/intentx-runtime) owns behavior. UI only triggers intent.

---

## 📦 Installation

```bash
npm install intentx-react
```

---

## 🚀 Quick Start (Headless Runtime)

Even though this is the React package, the runtime is fully usable without React.

```ts
import { createLogic } from "intentx-react"

const counterLogic = createLogic({
  state: { count: 0 },

  intents: bus => {
    bus.on("inc", ({ setState }) => {
      setState(s => { s.count++ })
    })

    bus.on<number>("add", ({ payload, setState }) => {
      setState(s => { s.count += payload })
    })
  },

  computed: {
    double: ({ state }) => state.count * 2
  }
})

async function main() {
  const runtime = counterLogic.create()

  await runtime.emit("inc")
  await runtime.emit("add", 5)

  console.log(runtime.state.double)
}

main()
```

✔ Deterministic  
✔ Fully testable  
✔ No React dependency  

---

## ⚛️ React Integration

React integration is a thin adapter over the runtime.

You have two options:

- `withLogic` (recommended)
- `useLogic`

---

#### 🧩 Option 1 — withLogic (Recommended)

Keeps your view pure.

```tsx
import { withLogic } from "intentx-react"
import { counterLogic } from "./counter.logic"

const CounterView = ({ state, emit }) => {
  return (
    <div>
      <h2>{state.count}</h2>
      <button onClick={() => emit("inc")}>+</button>
    </div>
  )
}

export const CounterPage =
  withLogic(counterLogic, CounterView)
```

Why recommended?

- No hooks inside the view
- View is easily testable
- Clear separation of concerns
- Logic reusable outside React

---

#### 🪝 Option 2 — useLogic

```tsx
import { useLogic } from "intentx-react"
import { counterLogic } from "./counter.logic"

export function Counter() {
  const { state, emit } = useLogic(counterLogic)

  return (
    <div>
      <h2>{state.count}</h2>
      <button onClick={() => emit("inc")}>+</button>
    </div>
  )
}
```

---

## 🧠 Computed State

```ts
computed: {
  double: ({ state }) => state.count * 2,
  triple: ({ state }) => state.count * 3,
}
```

Computed values:

- Are cached
- Track dependencies automatically
- Recompute only when needed

---

## 🌊 Async Logic

Async is just another intent.

```ts
bus.on("fetchUser", async ({ setState }) => {
  setState(s => { s.loading = true })

  const user = await api.getUser()

  setState(s => {
    s.user = user
    s.loading = false
  })
})
```

No special async API required.

---

## 🧪 Unit Testing

```ts
const logic = createLogic({
  state: { value: 0 },

  intents: bus => {
    bus.on<number>("set", ({ payload, setState }) => {
      setState(s => { s.value = payload })
    })
  },

  computed: {
    squared: ({ state }) => state.value * state.value
  }
})

const runtime = logic.create()

await runtime.emit("set", 4)

expect(runtime.state.squared).toBe(16)
```

---

## 📡  Multiple Logic Communication (Bus)

Each `logic` instance is isolated by default.

To enable communication between runtimes, you can share an Intent Bus.

---

### 1️⃣ Scoped Shared Bus (Recommended)

```ts
import { useLogic } from "intentx-react"

// ✅ Same scope → shared bus
useLogic(logic, {
  scope: "dashboard",
  sharedBus: true
})

// ❌ Different scope → different bus
useLogic(logic, {
  scope: "settings",
  sharedBus: true
})
```

<b>How it works</b>

When sharedBus: true is enabled:

- A singleton bus is created per scope

- Same scope → same bus instance

- Different scope → different bus

- No global leakage

If no `scope` is provided:

```ts
useLogic(logic, {
  sharedBus: true
})
```

→ uses a default global scope bus.

---

### 2️⃣ Custom Bus (Advanced / Cross-Scope)

```ts
import { createIntentBus } from "intentx-react"

const bus = createIntentBus()

useLogic(logicA, { bus })
useLogic(logicB, { bus })

```

<b>Behavior</b>

- Full cross-scope communication
- Manual orchestration control
- Suitable for:
  - Microfrontend
  - App-wide coordination
  - Complex workflow systems

### Behavior Comparison

| Mode                 | Isolation    | Scope-aware | Cross-scope  | Recommended           |
| -------------------- | -----------  | ----------- | ------------ | --------------------- |
| Default (no options) | ✅ Full      | ❌           | ❌           | Small/local logic     |
| `sharedBus: true`    | ❌ Per scope | ✅           | ❌           | Modular apps          |
| Custom `bus`         | ❌ Manual    | ❌           | ✅           | Advanced architecture |

### 🎯 Recommendation

✅ Use sharedBus for modular communication.  
✅ Use custom bus for orchestration layer.  
🚫 Avoid global single bus without scope in large apps.  

---

## 🔍 Comparison

This is not about “better” — it's about architectural intent.

| Criteria                       | intentx-react  | Redux Toolkit  | Zustand  | MobX          | Recoil |
|--------------------------------|----------------|----------------|----------|---------------|--------|
| **Primary abstraction**        | 🟢 Intent      | 🟢 Reducer      | 🟢 Store | 🟢 Observable | 🟢 Atom |
| **Single mutation entry**      | ✅             | ✅              | ❌       | ❌            | ❌     |
| **Built-in orchestration**     | ✅             | ⚠️ (middleware) | ❌       | ⚠️            | ❌     |
| **Async as first-class**       | ✅             | ⚠️ (thunk)      | ❌       | ⚠️            | ⚠️     |
| **Derived state built-in**     | ✅             | ❌              | ⚠️       | ✅            | ✅     |
| **Deterministic execution**    | ✅             | ⚠️              | ⚠️       | ⚠️            | ⚠️     |
| **Headless runtime**           | ✅             | ⚠️              | ⚠️       | ⚠️            | ❌     |
| **Backend / worker ready**     | ✅             | ⚠️              | ⚠️       | ❌            | ❌     |
| **Behavior-centric design**    | ✅             | ❌              | ❌       | ❌            | ❌     |

<br/>

🟢 = Primary design focus  
✅ = Built-in / first-class  
⚠️ = Possible but not first-class or requires extra tooling   
❌ = Not built-in

Most libraries answer:

> "How is state stored and updated?"

intentx answers:

> "What behavior happens when this event occurs?"

---

## 🔥 Philosophy

Use this if:

- You have complex async flows
- You want deterministic replayable behavior
- You share logic between frontend and backend
- You want strict mutation boundaries

Do not use this if:

- Your app only manages simple UI state
- Your async flows are trivial
- You don't need orchestration

---

## 📜 License

MIT