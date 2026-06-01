import { ACC_BY_ID, Screen } from "./accounts"
import { IC, Sys } from "./icons"

export function DemoPhone({
  id,
  tab,
  interactive = false,
  onTab,
}: {
  id: string
  tab: number
  interactive?: boolean
  onTab?: (tab: number) => void
}) {
  const a = ACC_BY_ID[id]
  return (
    <div className="dm-phone">
      <div className="dm-screen">
        <div className="dm-island" />
        <div className="dm-statusbar">
          <span className="time">9:41</span>
          <span className="sys">
            <Sys />
          </span>
        </div>
        <div className="dm-app">
          <div className={`dm-appbody${interactive ? " swap" : ""}`} key={tab}>
            <Screen id={id} tab={tab} />
          </div>
          <div className="dm-tabbar">
            {a.tabs.map(([label, ico], i) =>
              interactive ? (
                <button
                  key={label}
                  type="button"
                  className={`dm-tab${i === tab ? " on" : ""}`}
                  onClick={() => onTab?.(i)}
                >
                  {IC[ico]}
                  {label}
                </button>
              ) : (
                <div key={label} className={`dm-tab${i === tab ? " on" : ""}`}>
                  {IC[ico]}
                  {label}
                </div>
              ),
            )}
          </div>
          <div className="dm-homebar" />
        </div>
      </div>
    </div>
  )
}
