# Local libraries

This is an optional location for vendored browser libraries when an offline article uses separate files. A dependency-free or single-file article does not need this directory. Repository and hosted artifacts should follow their chosen environment's dependency conventions.

If D3 v7 is chosen, one possible bundled file is:

- `d3.v7.min.js`

For offline delivery, include every required dependency and asset, including licenses; never require remote scripts, styles, fonts, images, data, or API calls at runtime. Inline dependencies when practical, or package the complete directory as a zip when downloadable delivery is requested. Verify the promised opening method, including browser restrictions on local data and modules.

This directory contains no assumed D3 installation. Include the actual library before referencing it; do not deliver a missing-file placeholder. If D3 is unused, omit it. Other chosen libraries such as KaTeX, TopoJSON, or d3-sankey follow the same offline rules.
