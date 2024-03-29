import {
  Alert,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { customMessages, model, rules } from "@/lib/firestore/collections/team";
import { useEffect, useState } from "react";

import AdminLayout from "@/src/content/AdminLayout";
import Button from "@mui/material/Button";
import CountrySelect from "@/src/components/dropdown/CountrySelect";
import { DEFAULT_DARK_LOGO } from "@/src/config/global";
import GameSelect from "@/src/components/dropdown/GameSelect";
import { LoadingButton } from "@mui/lab";
import Validator from "validatorjs";
import { useAppContext } from "@/src/context/app";
import { useAuthContext } from "@/src/context/AuthContext";
import { useRouter } from "next/router";
import { useTournamentContext } from "@/src/context/TournamentContext";

const initialInputs = {
  ...model
};

const TeamCreateForm = ({ disabled }) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthContext();
  const [inputs, setInputs] = useState({ ...initialInputs });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { team } = useTournamentContext();

  const validate = (data, rule, messages) => {
    let validator = new Validator(data, rule, messages);
    if (validator.fails()) {
      setErrors(validator.errors.errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handle = {
    create: async (e) => {
      if (validate(inputs, rules, customMessages) === false) return;

      setSaving(true);

      const newTeam = {
        ...inputs,
        uid: user.id,
        createdAt: new Date(),
        players: [
          {
            id: user.id,
            position: 0, // Manager
            joinedOn: new Date()
          }
        ]
      };

      const res = await team.create(newTeam);

      setSaving(false);

      if (res.code === "succeed") {
        router.push("/team/" + res.id);
      } else if (res.code === "failed") {
        console.warn(res.message);
      }
    },
    inputs: (e) => {
      let { name, type, value } = e.target;
      if (type === "number") value = Number(value);
      setInputs({
        ...inputs,
        [name]: value
      });
    }
  };

  return (
    <Grid container rowSpacing={3} spacing={2}>
      <Grid item xs={12} md={6}>
        <InputLabel htmlFor="team-name">Team Name</InputLabel>
        <FormControl fullWidth error={errors.name !== undefined}>
          <OutlinedInput
            id="team-name"
            name="name"
            aria-describedby="team-name-helper"
            value={inputs.name}
            onChange={handle.inputs}
            sx={{ mt: 1 }}
            disabled={disabled}
            fullWidth
            required
          />
          {errors.name !== undefined && (
            <FormHelperText id="team-name-helper" sx={{ mt: 2 }}>
              {errors.name}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <InputLabel htmlFor="team-short">Short Name</InputLabel>
        <FormControl fullWidth error={errors.short !== undefined}>
          <OutlinedInput
            id="team-short"
            name="short"
            value={inputs.short}
            aria-describedby="team-short-helper"
            onChange={handle.inputs}
            sx={{ mt: 1 }}
            disabled={disabled}
            fullWidth
            required
          />
          {errors.short !== undefined && (
            <FormHelperText id="team-short-helper" sx={{ mt: 2 }}>
              {errors.short}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <InputLabel htmlFor="team-access-code">Access Code</InputLabel>
        <FormControl fullWidth error={errors.accessCode !== undefined}>
          <OutlinedInput
            id="team-access-code"
            name="accessCode"
            placeholder="####"
            value={inputs.accessCode}
            aria-describedby="team-access-code-helper"
            onChange={handle.inputs}
            sx={{ mt: 1 }}
            disabled={disabled}
            fullWidth
          />
          {errors.accessCode !== undefined && (
            <FormHelperText id="team-access-code-helper" sx={{ mt: 2 }}>
              {errors.accessCode}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <InputLabel htmlFor="team-residency">Residency</InputLabel>
        <CountrySelect
          disabled={disabled}
          sx={{ mt: 1, width: "100%" }}
          option={inputs.residency}
          setOption={(val) => setInputs((prev) => ({ ...prev, residency: val }))}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <InputLabel htmlFor="team-game">Game</InputLabel>
        <GameSelect
          disabled={disabled}
          sx={{ mt: 1, width: "100%" }}
          option={inputs.game}
          setOption={(val) => setInputs((prev) => ({ ...prev, game: val }))}
        />
      </Grid>
      <Grid item>
        <LoadingButton loading={saving} variant="contained" onClick={handle.create}>
          Register
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default TeamCreateForm;
