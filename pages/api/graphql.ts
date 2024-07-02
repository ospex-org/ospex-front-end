// pages/api/graphql.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GRAPH_API_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.THE_GRAPH_API_KEY}/subgraphs/id/F7Hen5NkuVfzJYQohSMcgHv6MSM5iQZFgifg1EwDGhQd`
const GRAPH_API_KEY = process.env.THE_GRAPH_API_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.post(
      GRAPH_API_URL,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GRAPH_API_KEY}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from The Graph' });
  }
};
