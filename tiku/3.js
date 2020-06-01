(context,request,callback)=>{
    if(request==='next'){
        return callback(undefined,`commonjs ${request}`);
    }
const notExternalModules=['next/app','next/document','next/link','next/error','string-hash','next/constants'];
if(notExternalModules.indexOf(request)!==-1){return callback();}// We need to externalize internal requests for files intended to
// not be bundled.
const isLocal=request.startsWith('.')||// Always check for unix-style path, as webpack sometimes
// normalizes as posix.
_path.default.posix.isAbsolute(request)||// When on Windows, we also want to check for Windows-specific
// absolute paths.
process.platform==='win32'&&_path.default.win32.isAbsolute(request);const isLikelyNextExternal=isLocal&&/[/\\]next-server[/\\]/.test(request);// Relative requires don't need custom resolution, because they
// are relative to requests we've already resolved here.
// Absolute requires (require('/foo')) are extremely uncommon, but
// also have no need for customization as they're already resolved.
if(isLocal&&!isLikelyNextExternal){return callback();}// Resolve the import with the webpack provided context, this
// ensures we're resolving the correct version when multiple
// exist.
let res;try{res=(0,_resolveRequest.resolveRequest)(request,`${context}/`);}catch(err){// If the request cannot be resolved, we need to tell webpack to
// "bundle" it so that webpack shows an error (that it cannot be
// resolved).
return callback();}// Same as above, if the request cannot be resolved we need to have
// webpack "bundle" it so it surfaces the not found error.
if(!res){return callback();}let isNextExternal=false;if(isLocal){// we need to process next-server/lib/router/router so that
// the DefinePlugin can inject process.env values
isNextExternal=/next[/\\]dist[/\\]next-server[/\\](?!lib[/\\]router[/\\]router)/.test(res);if(!isNextExternal){return callback();}}// `isNextExternal` special cases Next.js' internal requires that
// should not be bundled. We need to skip the base resolve routine
// to prevent it from being bundled (assumes Next.js version cannot
// mismatch).
if(!isNextExternal){// Bundled Node.js code is relocated without its node_modules tree.
// This means we need to make sure its request resolves to the same
// package that'll be available at runtime. If it's not identical,
// we need to bundle the code (even if it _should_ be external).
let baseRes;try{baseRes=(0,_resolveRequest.resolveRequest)(request,`${dir}/`);}catch(err){baseRes=null;}// Same as above: if the package, when required from the root,
// would be different from what the real resolution would use, we
// cannot externalize it.
if(baseRes!==res){return callback();}}// Default pages have to be transpiled
if(!res.match(/next[/\\]dist[/\\]next-server[/\\]/)&&(res.match(/[/\\]next[/\\]dist[/\\]/)||// This is the @babel/plugin-transform-runtime "helpers: true" option
res.match(/node_modules[/\\]@babel[/\\]runtime[/\\]/))){return callback();}// Webpack itself has to be compiled because it doesn't always use module relative paths
if(res.match(/node_modules[/\\]webpack/)||res.match(/node_modules[/\\]css-loader/)){return callback();}// Anything else that is standard JavaScript within `node_modules`
// can be externalized.
if(isNextExternal||res.match(/node_modules[/\\].*\.js$/)){const externalRequest=isNextExternal?// Generate Next.js external import
_path.default.posix.join('next','dist',_path.default.relative(// Root of Next.js package:
_path.default.join(__dirname,'..'),res)// Windows path normalization
.replace(/\\/g,'/')):request;return callback(undefined,`commonjs ${externalRequest}`);}// Default behavior: bundle the code!
callback();}