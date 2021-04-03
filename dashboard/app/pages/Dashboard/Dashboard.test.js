import React from 'react';
import {cleanup, render} from '@testing-library/react';
import 'isomorphic-fetch';
import { expect } from '@jest/globals';
require('jest-fetch-mock').enableMocks();

import Dashboard from '../Dashboard';
import { mockMetrics } from './mockMetrics';

afterEach(cleanup);

describe('CPU Monitor alerts', () => {
  it('Should renders', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockMetrics));
    const { findByText } = render(<Dashboard />);
    expect(await findByText('CPU Usage Percentage')).toBeInTheDocument();
    expect(await findByText('CPU Average load')).toBeInTheDocument();
  });
  
  it('Should show high load alerts and recover', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockMetrics));
    const { findByText } = render(<Dashboard />);
    expect(await findByText('High load detected.')).toBeInTheDocument();
    expect(await findByText('2021/04/02 14:50:19 - 2021/04/02 14:58:58')).toBeInTheDocument();
    expect(await findByText('Recovered from high load.')).toBeInTheDocument();
  });
});
