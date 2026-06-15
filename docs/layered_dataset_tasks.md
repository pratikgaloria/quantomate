# Task List: Layered Parent-Child Dataset Refactoring

This checklist tracks the refactoring tasks to replace the current strategy-centric trading loop with a memory-efficient and calculation-shared **Layered Parent-Child Dataset** architecture.

## Phase 1: Core Package Enhancements

- [ ] Modify [dataset.ts](file:///home/dev/projects/quantomate/packages/core/src/dataset.ts):
  - Allow `storage` to be protected/accessible to subclass inheritance.
  - Implement `indicatorRegistry` Map to track indicators by a unique identifier.
  - Implement `getOrRegisterIndicator(key, createFn)`.
- [ ] Rebuild `@quantomate/core`.

## Phase 2: Live Engine & Trade Package Updates

- [ ] Create [NamespacedDataset.ts](file:///home/dev/projects/quantomate/packages/trade/src/utils/NamespacedDataset.ts):
  - Implement `BotQuoteView` to proxy a `Quote` while namespacing strategy values (e.g. `botId:strategyName`).
  - Implement `ChildDataset` delegating values/writes to parent and returning wrapped `BotQuoteView` instances.
- [ ] Refactor [liveEngine.ts](file:///home/dev/projects/quantomate/packages/trade/src/liveEngine.ts):
  - Change trader mappings to maintain a single base dataset per `symbol:interval`.
  - Share indicators across strategies using `getOrRegisterIndicator`.
  - Wrap base datasets in `ChildDataset` instances per bot.
  - Loop and execute strategy apply logic over child dataset views.
- [ ] Rebuild `@quantomate/trade`.

## Phase 3: Verification & Tests

- [ ] Write unit tests for `BotQuoteView` and `ChildDataset` in `packages/trade/src/__tests__/NamespacedDataset.test.ts`.
- [ ] Run `npm run build` and ensure clean compilation.
- [ ] Run `npm test` and verify that all test suites pass.
