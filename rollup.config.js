import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
// import json from 'rollup-plugin-json';
// import copy from 'rollup-plugin-cpy';
import pkg from './package.json';
import svelte from 'rollup-plugin-svelte';
// import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'demo/App.html',
        output: { 
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'Demo'
        },
        plugins: [            
            svelte({            
                skipIntroByDefault: true,
                nestedTransitions: true,            
                dev: true,                
            }),            
            resolve({ jsnext: true }),            
            commonjs(),
            css({dest: 'public/main.css', minified: true}),            
            babel({include: ['src/**', 'demo/**','node_modules/svelte/shared.js']}),
            // terser(),
        ],
    },
    {
        input: 'index.js',
        output: { 
            file: pkg.module,
            format: 'cjs',
            sourcemap: true
        },
        plugins: [            
            svelte({            
                skipIntroByDefault: true,
                nestedTransitions: true,            
                dev: true,                
            }),
            resolve({jsnext: true}),                        
            commonjs(),
            css({dest: 'dist/scanex-html-editor.css', minified: false}),            
            babel({include: ['src/**','node_modules/svelte/shared.js']}),
            // terser(),
        ],
    },   
];