import { NextRequest, NextResponse } from 'next/server';

const CRM_URL = 'https://www.acronflow.com';
const API_KEY = 'acron_c1a2ecdbc97a60791460462ff61b6afa839f7621176e00a5015a824dbe3d7917';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const searchParams = new URL(request.url).searchParams;

        // Add API key to search params
        searchParams.set('apiKey', API_KEY);

        const targetUrl = `${CRM_URL}/api/${pathString}?${searchParams.toString()}`;

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = { error: 'Failed to parse JSON response from CRM' };
        }

        if (!response.ok) {
            return NextResponse.json({ ...data, _proxyStatus: response.status, success: false }, { status: 200 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 200 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        let body;
        try {
            body = await request.json();
        } catch (e) {
            body = {};
        }

        // Add API key to body if not present
        if (body && typeof body === 'object') {
            body.apiKey = API_KEY;
        }

        const targetUrl = `${CRM_URL}/api/${pathString}`;

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = { error: 'Failed to parse JSON response from CRM' };
        }

        if (!response.ok) {
            return NextResponse.json({ ...data, _proxyStatus: response.status, success: false }, { status: 200 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 200 }
        );
    }
}
