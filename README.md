# modular-esm-demo

This is a demo repository for Modular's experimental ESM CDN support.

<img width="400" alt="image" src="https://user-images.githubusercontent.com/315834/156772150-3252b2b9-2f29-4f2e-9e82-354a06779d94.png">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/315834/156772205-51c89751-a7f4-4d9e-a7aa-03c9e5f46728.png">

## Pre-requisites

- Modular >=3.1 should be used. I aliased it to `modular-dev` in the
  [Manual import demo](#manual-import-demo) section below

## How to run

In the repository there are two modular views, `view1` and `view2`, implementing
two simple demo applications. They have several dependencies, some of them in
common (`react`, `react-dom`, `minifaker`) and some of them not (`mantine`,
`regular-table`).

To run them independently, just start them normally:

`USE_MODULAR_ESBUILD='true' modular-dev start view1`
`USE_MODULAR_ESBUILD='true' modular-dev start view2`

They will get all their dependencies from the default ESM CDN (skypack, at the
moment) and they will be served on port 3000 like a normal standalone
application, with a synthetic `index.html` and an ESM `_trampoline.js` module to
bootstrap them.

Both the views, when built, contain a `index-[hash].js` esm module that can be
`import`ed at runtime from any
[modern](https://caniuse.com/mdn-javascript_statements_import)
[browser](https://caniuse.com/es6-module-dynamic-import).

## Manual import demo

_This is an example of how to load the two ESM views at runtime with the
browser's Developer Tools, to exemplify features like ease of use and dependency
deduplication_

- Build the two views:
  - `USE_MODULAR_ESBUILD='true' modular-dev build view1`
  - `USE_MODULAR_ESBUILD='true' modular-dev build view2`
- Serve them statically with something that supports CORS:
  - `cd dist/view1`
  - `http-server --cors -c-1 -p 5001 .`
  - `cd dist/view2`
  - `http-server --cors -c-1 -p 5002 .`
- Go to a page with no CSP policy and open the Dev Tools (`about:blank` won't
  allow you to import from the console)
- (optionally) clean its `body`
  - `document.body.innerHTML = "";`
  - `document.body.style.height = '100%';`
- Create a container, append it to the body and style it
  - `const container = document.createElement("div");`
  - `document.body.append(container);`
  - `container.style.cssText = 'display: flex; flex-direction: column; height: 100%';`
- Create one div per view, add them to the container and add some style / label
  - `const view1 = document.createElement("div");`
  - `const view2 = document.createElement("div");`
  - `container.append(view1);`
  - `container.append(view2);`
  - `view1.style.cssText = "overflow: scroll; position: relative; background: #ccc; height: 100%; padding: 8px";`
  - `view2.style.cssText = "overflow: scroll; position: relative; background: #eee; height: 100%; padding: 8px";`
  - `view1.innerText = 'VIEW 1';`
  - `view2.innerText = 'VIEW 2';`
- Import React and React-DOM as ESM modules to bootstrap the views
  - `const { default: React } = await import('https://cdn.skypack.dev/react');`
  - `const { default: ReactDom } = await import('https://cdn.skypack.dev/react-dom');`
- Import view1 dynamically (remember to substitute the hash)
  - `const { default: View1 } = await import('http://localhost:5001/static/js/index-[HASH].js');`
- Render it onto its container div
  - `ReactDom.render(React.createElement(View1, null), view1);`
- Import view2 dynamically (remember to substitute the hash)
  - `const { default: View2 } = await import('http://localhost:5002/static/js/index-[HASH].js');`
- Render it onto its container div
  - `ReactDom.render(React.createElement(View2, null), view2);`
- Import and apply view1 stylesheet (after, to show how it works) - this uses
  [CSS Module Scripts](https://web.dev/css-module-scripts/), which, if needed,
  can be sandboxed by the host at runtime.
  - `const cssModule = await import('http://localhost:5001/static/css/index-[HASH].css', { assert: { type: 'css' }});`
  - `document.adoptedStyleSheets = [...document.adoptedStyleSheets, cssModule.default];`
