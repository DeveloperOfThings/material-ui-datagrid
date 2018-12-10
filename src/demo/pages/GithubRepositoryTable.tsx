import * as React from "react";
import DataGrid, { PaginationState } from "../../lib/DataGrid";

const SEARCH = "//api.github.com/search/repositories";

// tslint:disable-next-line:no-empty-interface
interface IProps {}
interface IState {
  items: [];
  totalCount: number;
}

export default class GithubRepositoryTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      items: [],
      totalCount: 0
    }
  }
  public async componentDidMount() {
    const res = await fetch(`${SEARCH}?q=react`);
    const json = await res.json();
    const { items=[], total_count: totalCount = 0 } = json;
    this.setState({ items, totalCount });
  }

  public render() {
    const { items, totalCount } = this.state;
    const columns: IDataGridColumns[] = [
      { id: "full_name", label: "Repository Name", sortable: true },
      { id: "stargazers_count", label: "🌟", numeric: true, sortable: true },
      { id: "description", label: "Description", sortable: true }
    ];
    return (
      <DataGrid
        columns={columns}
        key="id"
        onCurrentPageChange={this.handleChangePage}
        onPageSizeChange={this.handleChangeRowsPerPage}
        onRowSelect={this.handleClick}
        onSortingChange={this.handleRequestSort}
        pagination={true}
        pageSize={30}
        remote={true}
        rows={items}
        rowsPerPageOptions={[30]}
        searchable={true}
        title="Github Repositories"
        totalCount={totalCount}
      />
    );
  }

  private handleRequestSort = async ({
    order,
    orderBy,
    page,
    rowsPerPage,
    ...paginationState
  }: PaginationState) => {
    const res = await fetch(
      `${SEARCH}?limit=${rowsPerPage}&offset=${page *
        rowsPerPage}&orderBy=${orderBy}&order=${order}`
    );
    const json = await res.json();
    const items = (json && json.items) || [];
    this.setState({ items });
  };

  private handleClick = ({ id }: MapLike<any>) => {
    // const { history } = this.props;
    // history.push(`accounts/${id}`);
  };

  private handleChangePage = async ({
    page,
    rowsPerPage,
    ...paginationState
  }: PaginationState) => {
    const res = await fetch(
      `${SEARCH}?limit=${rowsPerPage}&offset=${page * rowsPerPage}`
    );
    const json = await res.json();
    const items = (json && json.items) || [];
    this.setState({ items });
  };

  private handleChangeRowsPerPage = async ({
    page,
    rowsPerPage,
    ...paginationState
  }: PaginationState) => {
    const res = await fetch(
      `${SEARCH}?limit=${rowsPerPage}&offset=${page * rowsPerPage}`
    );
    const json = await res.json();
    const items = (json && json.items) || [];
    this.setState({ items });
  };

  // private async searchGithubRepo(
  //   q: string,
  //   sort?: "stars" | "forks" | "updated",
  //   order: "asc" | "desc" = "desc"
  // ) {
  //   const query = sort ? `${SEARCH}?q=${q}&sort=${sort}&order=${order}` : `${SEARCH}?q=${q}`;
  //   const res = await fetch(query);
  //   const json = await res.json();
  //   const { items = [], total_count: totalCount } = json;
  //   this.setState({ items, totalCount });
  // }
}
