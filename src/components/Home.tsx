import AdSide from "./AdSide"
import Score from "./Score"

const Home = () => {
    return (
        <div className="w-full px-3 sm:px-4 md:px-10 flex justify-between mt-6 gap-2">
            <AdSide />
            <Score />
            <AdSide />
        </div>
    )
}

export default Home