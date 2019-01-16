import React from 'react';
import PageShell from '../components/page_shell';
import {highlightJavascript} from '../components/prism_highlight.js';
import {prefixUrl} from '@mapbox/batfish/modules/prefix-url';
import Quickstart from '../components/quickstart';
import {version} from '../../package.json';
import docs from '../components/api.json'; // eslint-disable-line import/no-unresolved
import GithubSlugger from 'github-slugger';
import createFormatters from 'documentation/lib/output/util/formatters';
import LinkerStack from 'documentation/lib/output/util/linker_stack';
import ApiItem from '../components/api-item';

const meta = {
    title: 'Mapbox GL JS API',
    description: '',
    pathname: '/api'
};

const linkerStack = new LinkerStack({})
    .namespaceResolver(docs, (namespace) => {
        const slugger = new GithubSlugger();
        return `#${slugger.slug(namespace)}`;
    });

const formatters = createFormatters(linkerStack.link);

function formatType(type) {
    return <span dangerouslySetInnerHTML={{__html: formatters.type(type)}}/>;
}

function md(ast, inline) {
    if (inline && ast && ast.children.length && ast.children[0].type === 'paragraph') {
        ast = {
            type: 'root',
            children: ast.children[0].children.concat(ast.children.slice(1))
        };
    }
    return <span dangerouslySetInnerHTML={{__html: formatters.markdown(ast)}}/>;
}

function href(m) {
    return `#${m.namespace.toLowerCase()}`;
}

class Note extends React.Component {
    render() {
        const note = this.props;
        return (
            <div className=''>
                <section className='mb24 prose'>
                    <h2 id={note.namespace.toLowerCase()} className='txt-bold'>{note.name}</h2>
                    {note.description && <div className='color-gray txt-l'>{md(note.description)}</div>}
                </section>
            </div>
        );
    }
}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {token: '<your access token here>'};
    }

    render() {
        return (
            <PageShell meta={meta} onUser={(_, token) => this.setState({token})}>
                <h1>Mapbox GL JS</h1>
                <div className='py6 color-gray txt-s mt-neg24 mb12'>
                    Current version:{' '}<span className='round bg-gray-faint py3 px6'><a href='https://github.com/mapbox/mapbox-gl-js/releases'>mapbox-gl.js v{version}</a></span>
                </div>
                <p>Mapbox GL JS is a JavaScript library that uses WebGL to render interactive maps from <a href="https://www.mapbox.com/help/define-vector-tiles">vector tiles</a> and <a href={prefixUrl('/style-spec')}>Mapbox styles</a>. It is part of the Mapbox GL ecosystem, which includes <a href="https://www.mapbox.com/mobile/">Mapbox Mobile</a>, a compatible renderer written in C++ with bindings for desktop and mobile platforms. To see what new features our team is working on, take a look at our <a href={prefixUrl('/roadmap')}>roadmap</a>.</p>
                <div className='round doc clip mb6'>
                    {docs.map((doc, i) => doc.kind === 'note' ?
                        <Note key={i} {...doc}/> :
                        <ApiItem key={i} {...doc}/>)}
                </div>
            </PageShell>
        );
    }
}
