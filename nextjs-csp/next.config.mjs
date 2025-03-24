/** @type {import('next').NextConfig} */

const cspHeader = [
    "default-src 'self';",
    "child-src 'self' blob:;",
    "worker-src 'self' blob:;",
    "connect-src 'self'",
        "https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader-bundle@10.5.1000-iv-singlewasm/",
        "https://mlts.dynamsoft.com/",
        "https://slts.dynamsoft.com/",
        "https://mdls.dynamsoftonline.com/",
        "https://sdls.dynamsoftonline.com/;",
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",//
        "https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader-bundle@10.5.1000-iv-singlewasm/;",
    "media-src 'self' data:;",
    "img-src 'self' data: blob:;",
    "style-src-attr 'self' 'unsafe-inline';",
    "style-src 'self' 'unsafe-inline';",
].join(' ');

const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                      key: 'Content-Security-Policy',
                      value: cspHeader,
                    },
                ]
            }
        ]
    }
};

export default nextConfig;
