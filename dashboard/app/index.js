import '@babel/polyfill';

import React from 'react';
import { render } from 'react-dom';

import './styles/bootstrap.scss';
import './styles/plugins.scss';
import Dashboard from './pages/Dashboard';

render(
    <Dashboard />,
    document.querySelector('#root')
);