import React, {useContext} from "react"
import SettingsProvider from "../../../context/SettingsProvider"
import styles from "../styles/ViewTabs.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import VIEWS from "../../../../components/view/VIEWS"
import useLocalization from "../../../../global/useLocalization"
import Search from "../../../../components/search/Search"

export default function ViewTabs() {
    const settings = useContext(SettingsProvider)
    const translate = useLocalization("PROJECT", "VIEWPORT")

    return (
        <div className={styles.wrapper}>
            {settings.views.map((v, i) => (
                <div
                    data-highlight={`${i === settings.currentView}`}
                    key={"tab-view-" + i}
                    className={styles.tabWrapper}
                >
                    <button
                        onClick={() => settings.currentView = i}
                        className={styles.tab}
                        data-view={i}
                    >
                        {v.name}
                    </button>
                    <Dropdown className={styles.tab} hideArrow={true} styles={{padding: "0"}}>
                        <Icon styles={{fontSize: ".9rem"}}>more_vert</Icon>
                        <DropdownOptions>
                            <div style={{padding: "4px"}}>
                                <div className={styles.viewName}>
                                    <label>View name</label>
                                    <Search
                                        noPlaceHolder={true}
                                        searchString={v.name}
                                        setSearchString={v => {
                                            settings.views = settings.views.map((view, index) => {
                                                if (index === i)
                                                    view.name = v
                                                return view
                                            })
                                        }}
                                        noIcon={true} noPadding={true}
                                    />
                                </div>
                                <DropdownOption option={{
                                    label: translate("DELETE_VIEW"),
                                    onClick: () => {
                                        if (i === settings.currentView)
                                            settings.currentView = 0
                                        settings.views = settings.views.filter((_, index) => i !== index)
                                    },
                                }}/>

                            </div>
                        </DropdownOptions>
                    </Dropdown>
                </div>
            ))}
            {settings.views.length < 10 ?
                <button
                    onClick={() => settings.views = [...settings.views, {
                        name: translate("NEW_TAB") + settings.views.length,
                        bottom: [VIEWS.CONSOLE],
                        right: [VIEWS.HIERARCHY],
                        left: []
                    }]}
                    className={styles.tab}
                    style={{padding: "0", width: "17px"}}
                    data-highlight={"false"}
                >
                    <Icon styles={{fontSize: ".9rem"}}>
						add
                    </Icon>
                </button>
                :
                null
            }
        </div>
    )
}