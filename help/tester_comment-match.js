  /*
    fix(ivy): injecting incorrect Renderer2 into child components (#31063)
    ci: add josephperrott to `dev-infra` owners (#31205)
    Revert "build: update to rules_nodejs 0.32.2 (#31019)" (#31267)
    docs: add note about cli commands (#31216) PR Close #31216
    release: cut the v8.1.0-rc.0 release
    refactor: remove useless parameter to the function removeVnodes (#9914)
    chore: update sponsors [ci skip] (#9828)
    feat: detect and warn invalid dynamic argument expressions
    revert: fix(sfc): avoid deindent when pad option is specified (#7647)
    chore: fix lint
    revert to original bench code
  */


var regExp = new RegExp( 'revert[^a-z]*(.*):','gm');

//var str = 'Revert "build: update to rules_nodejs 0.32.2 (#31019)" (#31267)'
var str = 'fix(sfc): avoid deindent when pad option is specified (#7647)'

str = str.toLowerCase();
var regMatch = str.match( regExp );
console.log( regMatch )


var regExec = regExp.exec(str);
if( regExec && regExec.length ){
  console.log( regExec[1] );
}
