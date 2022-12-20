import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { TicketsList } from './components/ticketsList';
export type AppState = {
  tickets?: Ticket[];
  searchResults?: Ticket[];
  hideTicketsIds: string[];
  search: string;
  page: number;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    tickets: [],
    searchResults: [],
    hideTicketsIds: [],
    search: '',
    page: 1,
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
      const page = this.state.page + 1;
      const tickets = await api.getTickets(this.state.search, page);
      this.setState((prevState) => ({
        ...prevState,
        page,
        tickets: [...(prevState?.tickets || []), ...tickets],
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

  renderTickets = (tickets: Ticket[]) => {
    const filteredTickets = tickets.filter((t) =>
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
        tickets,
      }));
    }, 300);
  };

  render() {
    const { tickets, hideTicketsIds } = this.state;
    const isResetOption = hideTicketsIds.length > 0;

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
            <span>Showing {tickets.length} results</span>
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
