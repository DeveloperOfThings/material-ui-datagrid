import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import * as React from "react";

interface IProps {
  onMenuItemClick: (itemId: string) => void;
}

export const MainListItems = ({ onMenuItemClick }: IProps) => {
  const handleMenuItemClick = (itemId: string) => (
    e: React.MouseEvent<HTMLElement>
  ) => {
    onMenuItemClick(itemId);
  };
  return (
    <div>
      <ListItem onClick={handleMenuItemClick("simple")} button={true}>
        <ListItemText primary="Simple Table" />
      </ListItem>
      <ListItem onClick={handleMenuItemClick("enhanced")} button={true}>
        <ListItemText primary="Sorting & Selecting" />
      </ListItem>
      <ListItem onClick={handleMenuItemClick("customized")} button={true}>
        <ListItemText primary="Customized Table" />
      </ListItem>
      <ListItem onClick={handleMenuItemClick("customized")} button={true}>
        <ListItemText primary="Custom Table Pagination" />
      </ListItem>
      <ListItem onClick={handleMenuItemClick("spanning")} button={true}>
        <ListItemText primary="Spanning Table" />
      </ListItem>
      <ListItem onClick={handleMenuItemClick("api")} button={true}>
        <ListItemText primary="Api Integration" />
      </ListItem>
    </div>
  );
};
