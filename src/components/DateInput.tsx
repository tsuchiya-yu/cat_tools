'use client';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale/ja';
import { jaJP } from '@mui/x-date-pickers/locales';
import { styled, createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import { TextField } from '@mui/material';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// MUIコンポーネントをTailwindスタイルに合わせてカスタマイズ
const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    !['sectionListRef', 'areAllSectionsEmpty'].includes(prop as string),
})({
  '& .MuiOutlinedInput-root': {
    height: '64px',
    borderRadius: '24px',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '2px solid #fbcfe8',
    paddingLeft: '24px',
    paddingRight: '24px',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    '&:hover': {
      border: '2px solid #f9a8d4',
    },
    '&.Mui-focused': {
      border: '2px solid #e00070',
      boxShadow: '0 0 0 2px rgba(224, 0, 112, 0.35)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '0',
    color: '#111827',
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#e00070',
    },
  },
});

// DatePickerの選択色などを本体のピンクに合わせるテーマ
const pinkTheme = createTheme({
  palette: {
    primary: {
      main: '#e00070', // ピンク色を指定
    },
  },
});

export default function DateInput({ value, onChange, error }: DateInputProps) {
  const maxDate = new Date();

  // 文字列の日付をDateオブジェクトに変換
  const dateValue = value ? new Date(value) : null;

  // DateオブジェクトをYYYY-MM-DD形式の文字列に変換
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      // 日付をYYYY-MM-DD形式で返す
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="mb-4">
      <div className="label">誕生日を入力</div>
      <div className="row">
        {/* テーマを適用してコンポーネントの色をピンクに設定 */}
        <ThemeProvider theme={pinkTheme}>
          {/* 日本語化対応 */}
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ja} // date-fnsのロケールを日本語に設定
            localeText={
              jaJP.components.MuiLocalizationProvider.defaultProps.localeText
            } // MUIコンポーネントのテキストを日本語に設定
          >
            <DatePicker
              value={dateValue}
              onChange={handleDateChange}
              maxDate={maxDate}
              views={['year', 'month', 'day']}
              openTo="year"
              enableAccessibleFieldDOMStructure={false}
              slotProps={{
                textField: {
                  id: 'dob',
                  autoComplete: 'bday',
                  'aria-describedby': error ? 'error' : 'dobHelp',
                  error: !!error,
                  fullWidth: true,
                },
              }}
              slots={{
                textField: StyledTextField,
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
      </div>
      {error && (
        <div
          id="error"
          className="error text-red-600 text-sm mt-1.5 min-h-[1.2em]"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
