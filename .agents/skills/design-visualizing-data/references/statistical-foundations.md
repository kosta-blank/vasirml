# Statistical foundations for evidence presentation

Use the relevant checks when a graphic includes fitted models, tests, intervals, forecasts, causal language, or observations with dependence. Keep descriptive work proportionate. This reference supports interpretation and method screening; it does not replace statistical analysis or the dedicated ML evaluation workflow.

## Claim, data, and assumptions

Name the quantity being estimated or described, the target population, observation unit, comparison, and time horizon. Keep descriptive, associational, predictive, and causal claims distinct.

Record sampling or assignment, outcome support, exposure or denominator, weighting, repeated entities, clusters, time ordering, missingness, and exclusions. Aggregation can hide subgroup reversals or changes in composition. A weighted rate needs a documented denominator and weighting basis.

For each assumption material to an inferential claim, record:

| Assumption | Status | Evidence or missing check | Consequence for presentation |
|---|---|---|---|
| For example, observations are independent conditional on the specified model. | Supported, violated, or unknown. | Sampling design and relevant dependence diagnostics. | Identify whether estimates or uncertainty need analytical review. |

"Supported" means the available design and diagnostics support use, with stated limitations. It supplies no guarantee that the assumption holds. Do not fabricate missing diagnostic results.

## Analytical overlays and time dependence

A regression line, smoother, confidence band, or forecast encodes an analytical decision. Identify the method, target, fitted data, transformations, and assumptions before interpreting it. Check the outcome distribution and link, functional form, residual structure, influential observations, and variance assumptions as applicable. A smooth line alone supplies no inferential evidence.

For generalized linear models, the outcome family, link, and mean-variance relationship must fit the quantity being modeled. A binary outcome may justify a binomial/logit model; a timestamp alone cannot determine the model. See [statsmodels GLM formulation](https://www.statsmodels.org/stable/glm.html).

**Time-series example.** Fitting an ordinary logistic regression to serially dependent binary outcomes and reporting independence-based standard errors can misstate uncertainty. A logistic formulation can be appropriate when the outcome and temporal structure are modeled adequately. Check repeated units, trend, seasonality, structural changes, lag structure, and residual dependence relevant to the chosen method. Adding time as a predictor alone does not establish that dependence is handled.

[Statsmodels GEE](https://www.statsmodels.org/stable/generated/statsmodels.genmod.generalized_estimating_equations.GEE.html) documents logistic regression with autoregressive working dependence for grouped observations. Such a method still needs justified grouping, independent clusters, and adequate information; it is not a default repair for a single long series. Dependence handling should be reviewed in the analytical workflow.

Many time-series methods require stationarity or an appropriate treatment of changing mean, variance, and seasonal structure. Check the selected method's actual requirements; do not impose stationarity on every temporal model. [NIST stationarity guidance](https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc442.htm) explains the condition and common transformations.

A series of measurements on one entity is not automatically a series of independent replicates. Do not silently use row-wise resampling for dependent data, invent an effective sample size, or substitute a generic standard-error correction for an unexamined dependence structure. Preserve raw time plots and descriptive summaries when inferential assumptions remain unresolved.

## Uncertainty and comparisons

Label each interval's target, type, level, and method. Distinguish observed spread, standard deviation, standard error, confidence intervals, Bayesian credible intervals, and prediction intervals. State which uncertainty is represented and which sources, such as selection or measurement bias, remain outside the calculation.

A frequentist 95% confidence procedure has nominal repeated-sampling coverage under its assumptions. Do not give a realized interval a 95% probability interpretation about a fixed parameter. Bayesian credible statements depend on the specified model and prior. Prediction intervals concern future observations under the stated model. [NIST confidence limits](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm) clarifies confidence coverage.

For repeated or clustered observations, require a documented uncertainty method consistent with the design. For paired comparisons, preserve the pairing and use uncertainty for the difference when the claim concerns that difference. Visual overlap of separate intervals alone does not decide significance.

Show effect size, units, baseline, and practical context. Interpret p-values within the specified model; they do not measure effect size or the probability that a hypothesis is true. Avoid conclusions based only on a threshold, and disclose analytical selection. [ASA principles](https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf) support these interpretation rules.

Individual intervals or tests do not automatically provide simultaneous guarantees across many comparisons. Identify the comparison family and supplied multiplicity treatment when making inferential claims. [NIST multiple-comparison guidance](https://www.itl.nist.gov/div898/handbook/prc/section4/prc47.htm) explains why repeated pairwise testing changes the overall error rate.

## Exploration, prediction, and causality

Searching many subgroups, metrics, windows, thresholds, or model versions and presenting the strongest finding as prespecified evidence misrepresents the analysis. Disclose the search and keep discoveries exploratory unless a justified confirmatory analysis supports the claim. Do not silently invent a correction or a new confirmation protocol during chart creation.

Prediction claims depend on the target horizon and evaluation conditions. Distinguish in-sample fit from evidence about future outcomes, and flag future-information leakage or a mismatched time window for analytical review. ML evaluation owns the validation strategy.

Causal claims require identification assumptions grounded in the study design. A regression coefficient, correlation, temporal ordering, or before/after chart alone cannot establish an intervention's effect. Identify relevant assignment, confounding, comparison-group, and temporal assumptions. For an example of explicit identification conditions, [statsmodels treatment-effect methods](https://www.statsmodels.org/stable/treatment.html) state their conditional-independence requirement.

## When evidence is insufficient

State the problematic assumption, supplied evidence, and the claim it affects. Provide a descriptive view or narrower conclusion when useful. Identify the specific missing analytical review, such as dependence-aware uncertainty, a justified outcome model, or causal identification. Revisit the caption after that evidence exists; cosmetic changes cannot repair an invalid inferential calculation.
