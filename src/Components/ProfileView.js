import { Box } from "@mui/material";
import { Container } from "./Container";
import NavigationPanel from "./NavigationPanel";

const ProfileView = ({ userInfo, swingCount }) => {
  console.log(swingCount);
  console.log(userInfo);
  return (
    <Container style={{ backgroundColor: "#242424" }}>
      <Box sx={{ alignContent: "center" }}>
        <Box>
          <p className="HText">Hello {userInfo?.name.split(" ")[0]},</p>
        </Box>
        <Box sx={{ justifyItems: "center", padding: 2 }}>
          <div
            style={{
              backgroundColor: "green",
              padding: "1rem",
              borderRadius: "6rem",
              width: "6rem",
              height: "6rem",
              alignContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "5rem",
                margin: 0,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {userInfo?.name[0]}
            </p>
          </div>
        </Box>
        <Box>
          <p className="SHText">Uploaded Swings {swingCount?.length}</p>
          <NavigationPanel />
        </Box>
      </Box>
    </Container>
  );
};

export default ProfileView;
