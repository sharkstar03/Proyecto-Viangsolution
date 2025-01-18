import React from "react";
import { ListItem, ListItemText } from "@mui/material";

const FacturaItem = ({ factura }) => {
  return (
    <ListItem>
      <ListItemText
        primary={`Factura #${factura.number}`}
        secondary={`Cliente: ${factura.client} - Total: $${factura.total}`}
      />
    </ListItem>
  );
};

export default FacturaItem;
