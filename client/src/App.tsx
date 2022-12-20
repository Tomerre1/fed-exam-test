import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { TicketsList } from './components/ticketsList';
export type AppState = {
  tickets: Ticket[];
  searchResults: Ticket[];
  hideTicketsIds: string[];
  search: string;
  page: number;
  totalFetchedResults: number;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    tickets: [],
    searchResults: [],
    hideTicketsIds: [],
    search: '',
    page: 1,
    totalFetchedResults: 0,
  };

  searchDebounce: any = null;

  async componentDidMount() {
    this.setState({
      tickets: await api.getTickets(this.state.search, this.state.page),
    });
    window.addEventListener('scroll', this.loadMore);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore);
  }

  loadMore = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement?.scrollHeight
    ) {
      if (this.state.totalFetchedResults > this.state.tickets.length) {
        return;
      }
      const page = this.state.page + 1;
      const tickets = await api.getTickets(this.state.search, page);
      console.log('%c  tickets:', 'color: white;background: red;', tickets);
      this.setState((prevState) => ({
        ...prevState,
        page,
        tickets: [...(prevState?.tickets || []), ...tickets],
        totalFetchedResults: prevState.totalFetchedResults + tickets.length,
      }));
    }
  };

  onHide = (id: string) => {
    this.setState((prevState) => ({
      ...prevState,
      hideTicketsIds: [...prevState.hideTicketsIds, id],
    }));
  };

  onResetResults = () => {
    this.setState((prevState) => ({
      ...prevState,
      hideTicketsIds: [],
    }));
  };

  renderTickets = (generalTickets: Ticket[]) => {
    let tickets =
      this.state.search.length > 0 ? this.state.searchResults : generalTickets;

    const filteredTickets = tickets!.filter((t) =>
      (t.title.toLowerCase() + t.content.toLowerCase()).includes(
        this.state.search.toLowerCase()
      )
    );
    return (
      <TicketsList
        onHide={this.onHide}
        tickets={filteredTickets}
        hideTicketsIds={this.state.hideTicketsIds}
      />
    );
  };

  onSearch = async (val: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      const tickets = await api.getTickets(val, 1);
      this.setState((prevState) => ({
        ...prevState,
        search: val,
        searchResults: tickets,
      }));
    }, 300);
  };

  render() {
    const { tickets, hideTicketsIds, search, searchResults } = this.state;
    const isResetOption = hideTicketsIds.length > 0;
    const isSearchMode = search.length > 0;

    return (
      <main>
        <h1>Tickets List</h1>
        <header>
          <input
            type='search'
            placeholder='Search...'
            onChange={(e) => this.onSearch(e.target.value)}
          />
        </header>
        {tickets ? (
          <div className='results'>
            <span>
              Showing{' '}
              {(isSearchMode ? searchResults.length : tickets.length) -
                hideTicketsIds.length}{' '}
              results
            </span>
            {isResetOption && (
              <>
                (<span>{hideTicketsIds.length} hidden tickets - </span>
                <span onClick={this.onResetResults}>restore</span>)
              </>
            )}
          </div>
        ) : null}
        {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}{' '}
      </main>
    );
  }
}

export default App;
