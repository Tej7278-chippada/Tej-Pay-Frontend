import { Box, Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";

const SkeletonCards = () => (
  <Box marginTop={2}>
      
    <Grid container spacing={2} >
      {Array.from({ length: 12 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card style={{
                      borderRadius: '8px'
                    }}>
            {/* <Skeleton variant="rectangular" height={200} style={{ borderRadius: '8px' }} /> */}
            <CardContent>
              <Skeleton variant="text" height={30} width="60%" />
              <Skeleton variant="text" height={20} width="70%" />
              <Skeleton style={{display: 'inline-block',float: 'right'}} variant="text" height={20} width="40%" />
              <Skeleton variant="text" height={20} width="30%" />
              <Skeleton variant="text" height={20} width="90%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  );

export default SkeletonCards;