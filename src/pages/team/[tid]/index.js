import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import {
    Box,
    FormControl,
    InputLabel,
    FormHelperText,
    Grid,
    Paper,
    useTheme,
    Typography,
    TextField,
    Alert,
    OutlinedInput,
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Avatar
} from '@mui/material';
import dayjs from 'dayjs';

import AdminLayout from '@/src/content/AdminLayout';
import { useAppContext } from '@/src/context/app';
import { useRouter } from 'next/router';
import { useOrganizationContext } from '@/src/context/OrganizationContext';
import { useTournamentContext } from '@/src/context/TournamentContext';
import CountrySelect from '@/src/pages/components/CountrySelect';
import GameSelect from '@/src/pages/components/GameSelect';
import { useAuthContext } from '@/src/context/AuthContext';

const initialInputs = {
    name: '',
    short: '',
    accessCode: '',
    residency: '',
    game: ''
}

const Page = (props) => {
    const theme = useTheme();
    const router = useRouter();
    const { user } = useAuthContext();
    const { setTitle } = useAppContext();
    const [inputs, setInputs] = useState({ ...initialInputs });
    const { team, player } = useTournamentContext();
    const [tid, setTID] = useState(null);
    const [inviteUrl, setInviteUrl] = useState('');

    const handle = {
        invite: (e) => {
            navigator.clipboard.writeText(inviteUrl)
                .then(() => {
                    console.log('Content copied successfully!');
                }, () => {
                    console.error('Failed to copy');
                })
        }
    }

    useEffect(() => {
        const nid = router.query?.tid;
        setTID(nid);
        setInviteUrl(window.location.protocol + '://' + window.location.host + '/team/join?id=' + nid + '&&accessCode=' + team.teams[nid]?.accessCode);
    }, [router, team.teams])

    useEffect(() => {
        if (team.teams[tid]) {
            setInputs(prev => ({
                ...prev,
                ...team.teams[tid]
            }))
        }
    }, [tid])

    useEffect(() => {
        setTitle('TEAM INFO');
    }, [])

    return (
        <Paper sx={{ p: 4, bgcolor: theme.palette.card.main }}>
            <Grid container rowSpacing={3} spacing={2}>
                <Grid item xs={4} sx={{ minWidth: '200px' }}>
                    <Box textAlign={'center'}>
                        <img src={inputs.lightLogo ?? '/GR_Letters.png'} style={{ height: '200px', maxWidth: '200px', objectFit: 'contain' }} />
                    </Box>
                    <Box mt={1}>
                        <Grid container rowSpacing={2} spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Button
                                    variant='contained'
                                    sx={{ width: '150px' }}
                                    onClick={handle.invite}
                                >
                                    INVITE URL
                                </Button>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Button variant='contained' sx={{ width: '150px' }}>LEAVE TEAM</Button>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'center' }} hidden={team.teams[tid]?.uid != user.id}>
                                <Button variant='contained' sx={{ width: '150px' }} onClick={(e) => router.push('/team/' + tid + '/edit')}>
                                    EDIT TEAM
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Table border={'solid 1px'} size='medium'>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography variant='h4'>TEAM MEMBERS</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='center'>USER NAME</TableCell>
                                <TableCell align='center'>POSITION</TableCell>
                                <TableCell align='center'>RESIDENCY</TableCell>
                                <TableCell align='center'>JOINED ON</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {team.teams[tid]?.players.map((val, i) => (
                                <TableRow hover key={'user_' + val.id}>
                                    <TableCell align='center'>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                            <Avatar variant='circular' src={player.players[val.id].profilePic} />
                                            {player.players[val.id].name}
                                        </Box>
                                    </TableCell>
                                    <TableCell align='center'>
                                        {team.positions[val.position].name}
                                    </TableCell>
                                    <TableCell align='center'>{val.residency?.label}</TableCell>
                                    <TableCell align='center'>{dayjs(val.joinedOn.toDate()).format('DD. MMM. YYYY')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Paper>
    )
}

Page.getLayout = (page) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default Page;
