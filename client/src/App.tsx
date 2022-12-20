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
  isDarkMode: boolean;
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
    isDarkMode: true,
  };

  searchDebounce: any = null;

  async componentDidMount() {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light-mode');
    }
    const theme = localStorage.getItem('theme');
    const isDarkMode = theme === 'dark-mode';
    document.documentElement.classList.add(theme!);
    this.setState({
      tickets: await api.getTickets(this.state.search, this.state.page),
      isDarkMode,
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

  onSearch = async (val: string) => {
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

  toggleTheme = () => {
    if (this.state.isDarkMode) {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    }
    this.setState((prevState) => ({
      ...prevState,
      isDarkMode: !prevState.isDarkMode,
    }));
  };

  render() {
    const { tickets, hideTicketsIds, search, searchResults, isDarkMode } =
      this.state;
    const isResetOption = hideTicketsIds.length > 0;
    const isSearchMode = search.length > 0;

    return (
      <main>
        <button className='toggle-theme' onClick={this.toggleTheme}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </button>
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
