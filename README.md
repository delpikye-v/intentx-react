# 🧩 intentx-react

[![NPM](https://img.shields.io/npm/v/intentx-react.svg)](https://www.npmjs.com/package/intentx-react) ![Downloads](https://img.shields.io/npm/dt/intentx-react.svg)

<a href="https://codesandbox.io/p/sandbox/7tgzxw" target="_blank">LIVE EXAMPLE</a>

Official React adapter for **intentx-runtime**.   
Designed for deterministic orchestration across UI, backend, and workers.

> Intent-first business logic. React is just a view layer.

---

## 🧠 What is intentx?

`intentx-runtime` is a deterministic, intent-driven business logic runtime.

`intentx-react` is a thin React binding on top of that runtime.

You can use the runtime:

- In React
- In Node.js
- In workers
- In tests
- Without any UI

React is optional.

---

## 🏗 Mental Model

```
UI / HTTP / Queue / Cron
        ↓
     emit(intent)
        ↓
   middleware / effects
        ↓
   intent handlers
        ↓
     mutate state
        ↓
 computed (derived state)
```

Core principle:

> Intent is the only mutation entry point.
> The runtime owns behavior. UI only triggers intent.

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

## 🔄 Multiple Logic Communication

Multiple runtime instances can communicate through a shared intent bus.

By default, each `useLogic` call is fully isolated.  
To enable communication, you can share a bus.

---

#### 1️⃣ Scoped Global Bus

When `sharedBus = true`, runtimes share a bus **within the same scope**.

```ts
import { useLogic } from "intentx-react"

// ✅ Same scope → shared bus
useLogic(counterLogic, "app", true)
useLogic(userLogic, "app", true)

// ❌ Different scope → isolated
useLogic(counterLogic, "counter", true)
useLogic(userLogic, "user", true)
```

<b>Behavior</b>

- Same scope → runtimes can emit/listen to each other

- Different scope → fully isolated

- No global leakage

This is the recommended way for modular communication.

---

#### 2️⃣ Custom Bus (Advanced)

```ts
import { createIntentBus, useLogic } from "intentx-react"

const bus = createIntentBus()

useLogic(counterLogic, "counter", bus)
useLogic(userLogic, "user", bus)
```

<b>Behavior</b>

- Cross-scope communication
- Explicit orchestration control
- Useful for complex workflows or app-wide coordination

---

#### 🧠 Communication Modes

| Mode                            | Isolation | Cross Logic | Control |
| ------------------------------- | --------- | ----------- | ------- |
| Default                         | ✅ Full    | ❌ No        | Low     |
| `sharedBus = true` (same scope) | ⚖ Scoped  | ✅ Yes       | Medium  |
| Custom bus instance             | ❌ Manual  | ✅ Yes       | High    |


<br />

<b>⚠️ Important Notes</b>

- sharedBus = true shares by scope, not globally.
- Passing a bus instance overrides scope behavior.
- Scope and bus are immutable after mount.

---


## 🧭 Comparison (Conceptual)

| Criteria                       | intentx-runtime | Redux Toolkit  | Zustand | MobX         | Recoil |
|--------------------------------|----------------|-----------------|---------|---------------|--------|
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

## 🎯 When To Use

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

## 🪪 License

MIT