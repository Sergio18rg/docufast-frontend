/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "../ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CustomButton, ICONS } from "./custom-button";
import { Badge } from "../ui/badge";

const renderTableHeader = (headers: string[]) => {
  return (
    <TableHeader>
      <TableRow>
        {headers.map((header) => (
          <TableHead key={header}>{header}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

type TextCellProps = {
  primaryText: string;
  fallback?: string;
  secondaryText?: string;
  helperText?: string;
};

const TextCell = ({
  primaryText,
  fallback = "-",
  secondaryText = "",
  helperText,
}: TextCellProps) => {
  return (
    <TableCell>
      <div>
        <p>
          {primaryText || fallback} {secondaryText}
        </p>
        {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    </TableCell>
  );
};

type BadgeCellProps = {
  text: string | null | undefined;
  style?: React.CSSProperties;
  fallback?: string;
};

const BadgeCell = ({ text, style, fallback = "-" }: BadgeCellProps) => {
  if (!text) return <TableCell>{fallback}</TableCell>;

  return (
    <TableCell>
      <Badge variant="outline" style={style}>
        {text}
      </Badge>
    </TableCell>
  );
};

type DocumentsCellProps = {
  documents: Array<{
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
};
const DocumentsCell = ({ documents }: DocumentsCellProps) => {
  return (
    <TableCell>
      <div className="flex flex-wrap gap-2">
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.key} className="flex items-center gap-1 text-xs">
              <Icon className={`h-4 w-4 ${doc.color}`} />
              <span>{doc.label}</span>
            </div>
          );
        })}
      </div>
    </TableCell>
  );
};

const renderActions = ({
  onEdit,
  onDelete,
  deleteIcon = ICONS.DELETE,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  deleteIcon?: React.ReactNode;
}) => {
  if (!onEdit && !onDelete) return null;
  return (
    <TableCell
      className="flex justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      {onEdit && (
        <CustomButton
          onClick={onEdit}
          icon={ICONS.EDIT}
          variant="outline"
          size="sm"
        />
      )}
      {onDelete && (
        <CustomButton
          onClick={onDelete}
          icon={deleteIcon}
          variant="outline"
          size="sm"
        />
      )}
    </TableCell>
  );
};

const getCellRenderer = (type: string) => {
  switch (type) {
    case "TextCell":
      return TextCell;
    case "BadgeCell":
      return BadgeCell;
    case "DocumentsCell":
      return DocumentsCell;
    default:
      return TextCell;
  }
};

const tableRowRenderer = (tableData: unknown[], tableRows: any) => {
  return tableData.map((data: any) => {
    const rowId = data[tableRows.ID];
    const rowAction = tableRows.ROW_ACTION;

    return (
      <TableRow
        key={rowId}
        className="cursor-pointer hover:bg-slate-50"
        onClick={rowAction ? () => rowAction(data) : undefined}
      >
        {tableRows.COLUMN_DEFINITION.map((col: any) => {
          const CellRenderer = getCellRenderer(col.render);
          const props = col.getProps(data);
          return <CellRenderer key={col.key} {...props} />;
        })}

        {renderActions({
          onEdit: tableRows.ACTIONS?.onEdit
            ? () => tableRows.ACTIONS.onEdit(data)
            : undefined,
          onDelete: tableRows.ACTIONS?.onDelete
            ? () => tableRows.ACTIONS.onDelete(data)
            : undefined,
          deleteIcon: tableRows.ACTIONS?.getDeleteIcon
            ? tableRows.ACTIONS.getDeleteIcon(data)
            : ICONS.DELETE,
        })}
      </TableRow>
    );
  });
};

const renderSafeTableBody = ({
  isLoading,
  tableData,
  noDataMessage = "No data found.",
  colSpan = 8,
}: {
  isLoading?: boolean;
  tableData: unknown[];
  noDataMessage?: string;
  colSpan?: number;
}) => {
  if (isLoading)
    return (
      <TableRow>
        <TableCell colSpan={colSpan}>
          <Spinner className="mx-auto my-4" />
        </TableCell>
      </TableRow>
    );

  if (!tableData?.length)
    return (
      <TableRow>
        <TableCell colSpan={colSpan}>{noDataMessage}</TableCell>
      </TableRow>
    );
};

const CustomTable = ({
  headers,
  isLoading,
  tableData,
  noDataMessage,
  colSpan,
  tableRows,
}: {
  headers: string[];
  tableData: unknown[];
  tableRows: object;
  isLoading?: boolean;
  noDataMessage?: string;
  colSpan?: number;
}) => {
  return (
    <Table>
      {renderTableHeader(headers)}
      {
        <TableBody>
          {isLoading || !tableData.length
            ? renderSafeTableBody({
                isLoading,
                tableData,
                noDataMessage,
                colSpan,
              })
            : tableRowRenderer(tableData, tableRows)}
        </TableBody>
      }
    </Table>
  );
};

export { CustomTable };
