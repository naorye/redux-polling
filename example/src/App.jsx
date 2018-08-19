import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Recharts from 'recharts';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { pointPollingActions, pointPollingSelectors } from './state/point-polling';
import GitHubIcon from './GitHubIcon';

const styles = theme => ({
    title: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
    content: {
        margin: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    result: {
        margin: theme.spacing.unit,
    },
});

function App(props) {
    const {
        classes, isPointPollingActive, lastPoint, lastChange, history,
        startPollingPoint, stopPollingPoint, resetPollingPoint,
    } = props;
    return (
        <div className={ classes.root }>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit" className={ classes.title }>
                        Redux Polling Example
                    </Typography>
                    <IconButton color="inherit" aria-label="GitHub" href="https://github.com/naorye/redux-polling/tree/master/example">
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <div className={ classes.content }>
                <Typography component="h2" variant="subheading" gutterBottom>
                    Click on start and stop buttons to start and stop polling.
                    <br />
                    You can watch Dev Tools Network tab to see the traffic.
                </Typography>

                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={ () => startPollingPoint() }
                        disabled={ isPointPollingActive }
                        className={ classes.button }
                    >
                        Start Polling
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={ () => stopPollingPoint() }
                        disabled={ !isPointPollingActive }
                        className={ classes.button }
                    >
                        Stop Polling
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={ () => resetPollingPoint() }
                        className={ classes.button }
                    >
                        Reset Polling
                    </Button>
                </div>

                <div className={ classes.result }>
                    <Typography gutterBottom noWrap>
                        { `Status: ${isPointPollingActive ? 'Active' : 'Not Active'}` }
                    </Typography>

                    <Typography gutterBottom noWrap>
                        { `Last Point: ${lastPoint}` }
                    </Typography>

                    <Typography gutterBottom noWrap>
                        { `Change: ${lastChange}` }
                    </Typography>
                </div>

                <Grid container spacing={ 24 }>
                    <Grid item xs={ 4 }>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell numeric>
                                        Index
                                    </TableCell>
                                    <TableCell numeric>
                                        Point
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    history.map(item => (
                                        <TableRow key={ item.index }>
                                            <TableCell component="th" scope="row">
                                                { item.index }
                                            </TableCell>
                                            <TableCell numeric>
                                                { item.point }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={ 8 }>
                        <Recharts.LineChart
                            width={ 600 }
                            height={ 300 }
                            data={ history }
                            margin={ { top: 55 } }
                        >
                            <Recharts.Line type="monotone" dataKey="point" stroke="#8884d8" isAnimationActive={ false } />
                            <Recharts.CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <Recharts.XAxis dataKey="index" />
                            <Recharts.YAxis />
                        </Recharts.LineChart>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

App.propTypes = {
    /* eslint-disable-next-line react/forbid-prop-types */
    classes: PropTypes.object.isRequired,
    isPointPollingActive: PropTypes.bool,
    lastPoint: PropTypes.number,
    lastChange: PropTypes.number,
    history: PropTypes.arrayOf(PropTypes.shape({
        point: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
    })),
    startPollingPoint: PropTypes.func,
    stopPollingPoint: PropTypes.func,
    resetPollingPoint: PropTypes.func,
};

App.defaultProps = {
    isPointPollingActive: false,
    lastPoint: 0,
    lastChange: 0,
    history: [],
    startPollingPoint: () => {},
    stopPollingPoint: () => {},
    resetPollingPoint: () => {},
};

const mapStateToProps = state => ({
    isPointPollingActive: pointPollingSelectors.isPointPollingActive(state),
    history: pointPollingSelectors.getPointHistory(state),
    lastPoint: pointPollingSelectors.getLastPoint(state),
    lastChange: pointPollingSelectors.getLastChange(state),
});

const mapDispatchToProps = {
    startPollingPoint: pointPollingActions.start,
    stopPollingPoint: pointPollingActions.stop,
    resetPollingPoint: pointPollingActions.reset,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(App));
