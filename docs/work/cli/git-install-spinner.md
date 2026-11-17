# Fresh Git installation startup failure

Status: Complete

A fresh npm installation from Git omitted `cli-spinners`. Loading `cli/ui/live-progress.js` resolved that dependency before command dispatch, so even `--version` failed with `MODULE_NOT_FOUND`, as did `init`.

Reproduction: install commit `523024a` through a local `git+file` URL into a fresh prefix/cache outside the source tree and invoke the installed CLI. The dependency was absent from both the package and the installation's top-level node_modules. An installation inside the source tree misleadingly passed because Node resolved the developer checkout's ancestor node_modules.

Cause: the package declared a bundled dependency, but the fresh Git checkout had no installed dependency to bundle and no npm lifecycle preparation step. Previous verification proved populated-worktree archives and missed the Git route recommended in the docs.

Fix: the runtime owns its small default spinner definition. Package and lockfile have no external runtime dependencies. Custom spinner injection and the null/default fallback retain their previous behavior. Documentation describes Git and archive installation consistently.

Prevention: `test/git-install.test.js` commits a clean runtime fixture without node_modules, installs through Git with a fresh offline npm cache, and invokes the npm-generated shim in an isolated home/project. It checks actual Tier A installation and root contracts. The fixture is outside the source tree, so ancestor packages cannot mask missing dependencies.

Evidence: all 224 repository tests passed on Windows, including the fresh Git-install regression. The archive passed 22 checks across 54 commands. Independent review found no production blockers; its test recommendations were applied: use a global prefix with normal lifecycle behavior and resolve npm-cli directly for Windows paths containing spaces. The final direct test runner passed all 224 tests, including the global Git-install proof. macOS execution was not available in this session.
