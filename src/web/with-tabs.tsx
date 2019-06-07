import React from 'react'

export const TabsContext = React.createContext(null)

export class TabsProvider extends React.Component {
  state = {
    currentTab: null,
    hasTabs: chrome && chrome.tabs
  }

  componentDidMount() {
    if (chrome && chrome.tabs) {
      chrome.tabs.getSelected(null, currentTab => {
        this.setState({
          currentTab
        })
      })
    }
  }

  render() {
    return (
      <TabsContext.Provider value={{
        ...this.state
      }}>
        {
          !this.state.hasTabs || this.state.currentTab ? this.props.children : null
        }
      </TabsContext.Provider>
    )
  }
}
