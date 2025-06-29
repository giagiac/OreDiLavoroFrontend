"use client";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { ItemProps, ListProps, Virtuoso } from "react-virtuoso";

type SelectExtendedInputProps<T extends object> = {
  label: string;
  error?: string;
  testId?: string;
  disabled?: boolean;
  options: T[];
  renderSelected: (option: T) => React.ReactNode;
  renderOption: (option: T) => React.ReactNode;
  keyExtractor: (option: T) => string;
  onEndReached?: () => void;
  onChangeCallback: (value: T | null) => void; // Tipo per la callback
} & (
  | {
      isSearchable: true;
      searchLabel: string;
      searchPlaceholder: string;
      search: string | number;
      onSearchChange: (search: string) => void;
    }
  | {
      isSearchable?: false;
    }
);

const MUIComponents = {
  List: forwardRef<HTMLDivElement, ListProps>(function MuiList(
    { style, children },
    listRef
  ) {
    return (
      <List
        style={{ padding: 0, ...style, margin: 0 }}
        component="div"
        ref={listRef}
      >
        {children}
      </List>
    );
  }),

  Item: ({ children, ...props }: ItemProps<unknown>) => {
    return (
      <ListItem component="div" {...props} style={{ margin: 0 }} disablePadding>
        {children}
      </ListItem>
    );
  },
};

function SelectExtendedInputRaw<T extends object>(
  props: SelectExtendedInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T | null) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLDivElement | null>
) {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      boxRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  // const value = JSON.stringify(
  //   props.value ? props.renderOption(props.value) : ""
  // );

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div>
        <Box mb={0.5} ref={boxRef}>
          <TextField
            size="small"
            ref={ref}
            name={props.name}
            value={props.value ? props.renderOption(props.value) : ""}
            onBlur={props.onBlur}
            label={props.label}
            variant="outlined"
            onClick={() => {
              if (props.disabled) return;
              setIsOpen((prev) => !prev);
            }}
            fullWidth
            error={!!props.error}
            data-testid={props.testId}
            helperText={props.error}
            disabled={props.disabled}
            InputProps={{
              readOnly: true,
              endAdornment: props.value ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onChange(null);
                    props.onChangeCallback(null);
                  }}
                  data-testid={`${props.testId}-clear`}
                >
                  <ClearIcon />
                </IconButton>
              ) : null,
            }}
            slotProps={{
              formHelperText: {
                ["data-testid" as string]: `${props.testId}-error`,
              },
            }}
          />
        </Box>

        {isOpen && (
          <Card
            sx={{
              position: "absolute",
              zIndex: 100,
              width: 400,
            }}
          >
            <CardContent
              sx={{
                p: 0,
                "&:last-child": {
                  pb: 0,
                },
              }}
            >
              {props.isSearchable && (
                <Box p={2}>
                  <TextField
                    placeholder={props.searchPlaceholder}
                    value={props.search}
                    onChange={(e) => props.onSearchChange?.(e.target.value)}
                    label={props.searchLabel}
                    variant="outlined"
                    autoFocus
                    fullWidth
                    data-testid={`${props.testId}-search`}
                  />
                </Box>
              )}

              <Virtuoso
                style={{
                  height:
                    props.options.length <= 6 ? props.options.length * 48 : 320,
                }}
                data={props.options}
                endReached={props.onEndReached}
                components={MUIComponents}
                itemContent={(index, item) => (
                  <ListItemButton
                    selected={
                      props.value
                        ? props.keyExtractor(item) ===
                          props.keyExtractor(props.value)
                        : false
                    }
                    onClick={() => {
                      props.onChange(item);
                      props.onChangeCallback(item); // Chiamata alla callback
                      setIsOpen(false);
                    }}
                  >
                    {item ? (
                      <ListItemText primary={props.renderOption(item)} />
                    ) : (
                      <></>
                    )}
                  </ListItemButton>
                )}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </ClickAwayListener>
  );
}

const SelectExtendedInput = forwardRef(SelectExtendedInputRaw) as never as <
  T extends object,
>(
  props: SelectExtendedInputProps<T> & {
    onChangeCallback: (value: T) => void; // Tipo per la callback
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLDivElement | null> }
) => ReturnType<typeof SelectExtendedInputRaw>;

function FormSelectExtendedInput<
  TFieldValues extends FieldValues = FieldValues,
  T extends object = object,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> &
    SelectExtendedInputProps<T>
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <SelectExtendedInput<T>
          {...field}
          isSearchable={props.isSearchable}
          label={props.label}
          error={fieldState.error?.message}
          disabled={props.disabled}
          testId={props.testId}
          options={props.options}
          renderSelected={props.renderSelected}
          renderOption={props.renderOption}
          keyExtractor={props.keyExtractor}
          search={props.isSearchable ? props.search : ""}
          onSearchChange={
            props.isSearchable ? props.onSearchChange : () => undefined
          }
          onEndReached={props.isSearchable ? props.onEndReached : undefined}
          searchLabel={props.isSearchable ? props.searchLabel : ""}
          searchPlaceholder={props.isSearchable ? props.searchPlaceholder : ""}
          onChangeCallback={props.onChangeCallback}
        />
      )}
    />
  );
}

export default FormSelectExtendedInput;
