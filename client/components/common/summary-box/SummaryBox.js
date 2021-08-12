import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const styles = () => ({
  container: {
    textAlign: 'center',
  },
  root: {
    padding: '5px 10px',
    marginLeft: 90,
  },
  number: {
    display: 'block',
    fontSize: 24,
    color: grey[800],
    paddingBottom: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    color: grey[800],
  },
  iconSpan: {
    float: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 75,
    textAlign: 'center',
  },
  icon: {
    height: 48,
    width: 48,
    maxWidth: '100%',
  },
});

const SummaryBox = (props) => {
  const { classes, color, title, value, Icon } = props;

  return (
    <Card className={classes.container}>
      <CardContent>
        <Grid container justify="center">
          <Grid item>
            <span className={classes.iconSpan} style={{ color }}>
              <Icon className={classes.icon} />
            </span>

            <div className={classes.root}>
              <span className={classes.number}>{value}</span>
              <span className={classes.text}>{title}</span>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

SummaryBox.propTypes = {
  classes: PropTypes.object.isRequired,
  Icon: PropTypes.any,
  title: PropTypes.string,
  value: PropTypes.string,
};

export default withStyles(styles)(SummaryBox);
