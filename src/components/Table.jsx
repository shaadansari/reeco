import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import Typography from "@mui/material/Typography";

import { useDispatch, useSelector } from "react-redux";

import apple from "../assets/apple.png";
import avocado from "../assets/Avocado.jpg";
import StatusChips from "./StatusChips";
import MissingDialog from "./MissingDialog";

import { fetchData, postData } from "../store/dataSlice";

const images = { apple, avocado };
const colors = { success: "#06662e", warning: "#b60523", info: "#c9430f" };

export default function Tables() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState({});
  const data = useSelector((state) => state.data);

  console.log(data);

  React.useEffect(() => {
    console.log("run");
    dispatch(fetchData());
    // dispatch(
    //   postData({
    //     endPoint: 1,

    //     body: {
    //       firstName: "Fred",
    //       lastName: "Flintstone",
    //     },
    //   })
    // );
  }, [dispatch]);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = (response) => {
    if (response === true) {
      dispatch(
        postData({
          endPoint: selectedRow?.id,

          body: {
            ...selectedRow,
            status: "warning",
          },
        })
      );
      setOpen(false);
      setSelectedRow({});
    } else if (response === false) {
      dispatch(
        postData({
          endPoint: selectedRow?.id,

          body: {
            ...selectedRow,
            status: "info",
          },
        })
      );
      setOpen(false);
      setSelectedRow({});
    } else {
      setOpen(false);
      setSelectedRow({});
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          // minWidth: 650,
          border: `1px solid ${theme.palette.grey[300]}`,
          width: { xs: "100%", md: "80%" },
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={"20px"}></TableCell>

              <TableCell width={"150px"}>Product Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.status === "succeeded" &&
              data?.items.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <img
                      src={images[row.image]}
                      alt="apple"
                      width="40px"
                      height="40px"
                    />
                  </TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.brand}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>
                    {row?.status && <StatusChips status={row?.status} />}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <DoneIcon
                        // color={row.status}
                        sx={{
                          color:
                            row.status === "success"
                              ? colors[row.status]
                              : theme.palette.grey[500],
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          dispatch(
                            postData({
                              endPoint: row?.id,

                              body: {
                                ...row,
                                status: "success",
                              },
                            })
                          )
                        }
                      />

                      <ClearIcon
                        onClick={() => handleClickOpen(row)}
                        sx={{
                          color:
                            row.status === "info" || row.status === "warning"
                              ? colors[row.status]
                              : theme.palette.grey[500],
                          cursor: "pointer",
                        }}
                      />
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        Edit
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {data?.status === "loading" && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
            {data?.status === "failed" && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>Error loading data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <MissingDialog
          open={open}
          handleClose={handleClose}
          selectedRow={selectedRow}
        />
      )}
    </Box>
  );
}
