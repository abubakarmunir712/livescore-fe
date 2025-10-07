import { AdSlot } from "./AdSpace"

const AdSide = () => {
    return (
        <aside className="hidden w-[20%] lg:flex min-h-[80dvh] h-fit text-text border-border border flex-col items-center justify-start gap-6 p-4">
            {/* 160x300 Ad */}
            <AdSlot
                id="ad-160x300"
                script="//www.highperformanceformat.com/4948e60d9c28a58269d15c3869f7083b/invoke.js"
                options={{
                    key: "4948e60d9c28a58269d15c3869f7083b",
                    format: "iframe",
                    height: 300,
                    width: 160,
                    params: {}
                }}
            />

            {/* 160x600 Ad */}
            <AdSlot
                id="ad-160x600"
                script="//www.highperformanceformat.com/aab13caa7e7a04c01858a4494339a3ec/invoke.js"
                options={{
                    key: "aab13caa7e7a04c01858a4494339a3ec",
                    format: "iframe",
                    height: 600,
                    width: 160,
                    params: {}
                }}
            />

            {/* 300x250 Ad */}
            <AdSlot
                id="ad-300x250"
                script="//www.highperformanceformat.com/3929c587aef5911b6391f234a7bb11e6/invoke.js"
                options={{
                    key: "3929c587aef5911b6391f234a7bb11e6",
                    format: "iframe",
                    height: 250,
                    width: 300,
                    params: {}
                }}
            />
        </aside>
    )
}

export default AdSide