'use client';

import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useTheme } from 'next-themes';
import Loading from '@/components/client/Loading';
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import Link from 'next/link';
// import { ToastContainer, toast } from 'react-toastify';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegFileExcel, FaRegFilePdf } from 'react-icons/fa';
import {
  checklist,
  checklist_library,
  maintenance,
  task,
} from '@prisma/client';
import { LuFilePlus2, LuChevronDown } from 'react-icons/lu';
import moment from 'moment';
import { createChecklist } from '@/app/api/server-actions';
import { Border, Cell, Column, Workbook } from 'exceljs';
import { SimplifiedTask } from '@/utils/model/nested-maintenance';
import { base64Image } from '@/public/client-icon-base64';
import { saveAs } from 'file-saver';
import { Result } from '@/utils/function/result';

export default function TaskMaintenance({
  maintenance,
  checklistLibraryList,
  children,
}: {
  maintenance: maintenance;
  checklistLibraryList: checklist_library[];
  children: React.ReactNode;
}) {
  let [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistDescription, setNewChecklistDescription] = useState('');
  const [selectedSaveOption, setSelectedSaveOption] = useState(
    new Set(['saveOnly']),
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const descriptionsMap = {
    saveOnly: 'Save only for this maintenance.',
    saveAsLibrary:
      'Save for current maintenance and create a new library for future use.',
    onlyLibrary: 'Only save as library and not use for current maintenance.',
  };

  const labelsMap: { [key: string]: string } = {
    saveOnly: 'Save only',
    saveAsLibrary: 'Save and create library',
    onlyLibrary: 'Only save as library',
  };

  const selectedSaveOptionCurrent = Array.from(selectedSaveOption)[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleClose() {
    setOpenAddChecklist(false);
    setNewChecklistTitle('');
    setNewChecklistDescription('');
    setSelectedSaveOption(new Set(['saveOnly']));
    setOpenAddChecklist(!openAddChecklist);
  }

  function createChecklistClient() {
    const newChecklist: checklist = {
      uid: `CL-${moment().format('YYMMDDHHmmssSSS')}`,
      created_by: '',
      created_on: new Date(),
      updated_by: '',
      updated_on: new Date(),
      maintenance_uid: maintenance.uid,
      color: null,
      icon: null,
      title: newChecklistTitle,
      description: newChecklistDescription,
    };

    startTransition(() => {
      createChecklist(newChecklist);
    });
  }

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  }

  async function importExcel() {
    if (selectedFile) {
      const workbook = new Workbook();
      const reader = new FileReader();

      reader.onload = async (event: any) => {
        const buffer = event.target.result;
        await workbook.xlsx.load(buffer);
        //const worksheet = workbook.getWorksheet(1);
        const worksheet = workbook.worksheets[0];

        let simplifiedTask: SimplifiedTask[] = [];

        // worksheet.eachRow((row, rowNumber) => {
        //   if (rowNumber !== 1) {
        //     simplifiedTask.push({
        //       uid: `T-${moment().format('YYMMDDHHmmssSSS')}`,
        //       created_by: '',
        //       created_on: new Date(),
        //       updated_by: '',
        //       updated_on: new Date(),
        //       checklist_uid: '',
        //       title: row.getCell(1).value,
        //       description: row.getCell(2).value,
        //       is_completed: false,
        //       is_skipped: false,
        //       is_na: false,
        //       is_commented: false,
        //       comment: '',
        //     });
        //   }
        // });

        for (let index = 9; index <= worksheet.rowCount; index++) {
          const row = worksheet.getRow(index);

          const task: SimplifiedTask = {
            no: row.getCell(1).value as number,
            uid: row.getCell(2).value as string,
            taskActivity: 'Monkey',
            remarks: 'remarks',
            isComplete: '/',
          };

          simplifiedTask.push(task);
        }

        console.log(simplifiedTask);

        setTimeout(() => {
          //loading false
        }, 3000);

        reader.readAsArrayBuffer(selectedFile);
        setSelectedFile(null);
      };
    } else {
      console.log('other value');
    }
  }

  async function exportToExcel() {
    const workbook = new Workbook();
    const worksheetName = `${maintenance.uid}`;
    const filename = `Maintenance-${maintenance.uid}`;
    const title = `Maintenance ${maintenance.uid}`;
    const columns: Partial<Column>[] = [
      { key: 'no', width: 5 },
      { key: 'uid', width: 20 },
      { key: 'taskActivity', width: 40 },
      { key: 'remarks', width: 20 },
      { key: 'isComplete', width: 13, alignment: { horizontal: 'center' } },
    ];

    const checklistResult: Result<checklist[]> = await fetch(
      `/api/checklist?maintenance_uid=${maintenance.uid}`,
    ).then(res => res.json());

    if (
      checklistResult.statusCode !== 200 ||
      checklistResult.data === undefined
    )
      throw new Error(checklistResult.statusMessage);

    let simplifiedTask: SimplifiedTask[] = [
      {
        uid: 'T-1923861239',
        no: 1,
        taskActivity: 'Monkey',
        remarks: 'remarks',
        isComplete: '/',
      },
    ];

    // const customSort = (a: SimplifiedTask, b: SimplifiedTask) => a.no - b.no;
    // simplifiedTask = simplifiedTask.sort(customSort);

    const saveExcel = async () => {
      try {
        const worksheet = workbook.addWorksheet(worksheetName);
        worksheet.columns = columns;
        worksheet.mergeCells('A1:D1');

        const titleCell: Cell = worksheet.getCell('A1');
        titleCell.value = title;
        titleCell.font = { name: 'Calibri', size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });

        worksheet.addImage(imageId, {
          tl: { col: 4.99, row: 0.1 },
          ext: { width: 53, height: 55 },
        });
        worksheet.getRow(1).height = 45;

        // Row 3
        worksheet.mergeCells('A3:B3');
        worksheet.mergeCells('C3:E3');
        worksheet.getCell('A3').value = 'Date';
        worksheet.getCell('C3').value = moment(maintenance.date).format(
          'DD/MM/YYYY',
        );

        // Row 4
        worksheet.mergeCells('A4:B4');
        worksheet.mergeCells('C4:E4');
        worksheet.getCell('A4').value = 'Location';
        worksheet.getCell('C4').value = maintenance.approved_by;

        // Row 5
        worksheet.mergeCells('A5:B5');
        worksheet.mergeCells('C5:E5');
        worksheet.getCell('A5').value = 'Tag No.';
        worksheet.getCell('C5').value = maintenance.attachment_path;

        // Row 6
        worksheet.mergeCells('A6:B6');
        worksheet.mergeCells('C6:E6');
        worksheet.getCell('A6').value = 'Maintenance No.';
        worksheet.getCell('C6').value = maintenance.uid;

        // Row 7
        worksheet.addRow([]);

        worksheet.addRows([
          [3, 'Alex', '44'],
          { id: 4, name: 'Margaret', age: 32 },
        ]);

        worksheet.addRow([2, 'Mary Sue', 22]);

        // Row 8

        if (!checklistResult.data) {
          return;
        }

        const hye = await returningStuff();

        if (checklistResult.data) {
          checklistResult.data.forEach(async checklist => {
            const taskListResult: Result<task[]> = await fetch(
              `/api/task?checklist_uid=${checklist.uid}`,
            ).then(res => res.json());

            if (taskListResult.data) {
              const taskListSimplified: SimplifiedTask[] =
                taskListResult.data.map(task => {
                  return {
                    uid: task.uid,
                    no: task.task_order,
                    taskActivity: task.task_activity,
                    remarks: task.description,
                    isComplete: task.is_complete ? 'Yes' : 'No',
                  };
                });

              console.log(taskListSimplified);
              worksheet.addRow([2, 'Mary Suez', 22]);
              worksheet.addRow([{ id: checklist.title }]);
              worksheet.addRow(['No.', 'Id', 'Task', 'Remarks', 'Is Complete']);
              console.log('here');
            } else {
              console.error('apparently empty here');
            }

            // worksheet.addRow(dummyTask);
          });
        } else {
          worksheet.addRow([2, 'Mary Suez', 872634872534]);
        }

        console.log('here 23526');

        worksheet.addRow([2, 'Mary Suez', 223]);

        // // Row 8
        // worksheet.addRow(['No.', 'Id', 'Task', 'Remarks', 'Is Complete']);
        // worksheet.getRow(8).font = { name: 'Calibri', size: 11, bold: true };

        // // Row 9
        // simplifiedTask.forEach((task: SimplifiedTask) => {
        //   worksheet.addRow(task);
        // });

        const borderWidth: Partial<Border> = { style: 'thin' };

        for (let index = 8; index <= simplifiedTask.length + 8; index++) {
          worksheet.getRow(index).eachCell((cell: Cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }

        for (let index = 3; index <= 6; index++) {
          worksheet.getRow(index).eachCell((cell: Cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }

        for (let i = 1; i <= 5; i++) {
          const cell = worksheet.getRow(1).getCell(i);
          cell.border = {
            top: borderWidth,
            bottom: borderWidth,
          };

          if (i === 1) {
            cell.border.left = borderWidth;
          } else if (i === 5) {
            cell.border.right = borderWidth;
          }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${filename}.xlsx`);
      } catch (error) {
        console.error(error);
      } finally {
        workbook.removeWorksheet(worksheetName);
      }
    };

    await saveExcel();
  }

  async function returningStuff() {
    return 'hye';
  }

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Fragment>
      <Card
        className={`rounded-md p-4 m-4 flex-grow ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      >
        <div className="flex flex-row">
          <Button
            className="max-w-min"
            as={Link}
            href="/task"
            startContent={<IoIosArrowBack />}
            variant="faded"
            size="md"
          >
            Back
          </Button>
        </div>
        <div className="flex flex-row justify-between items-center my-4 ">
          <h2 className="text-xl font-semibold">{maintenance.uid}</h2>
          <div className="flex flex-row space-x-1">
            <Button
              isIconOnly
              variant="faded"
              onPress={() => setOpenAddChecklist(!openAddChecklist)}
            >
              <LuFilePlus2 />
            </Button>
            <Modal isOpen={openAddChecklist} hideCloseButton backdrop="blur">
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  Add New Checklist
                </ModalHeader>
                <ModalBody>
                  {/* <Select label="Checklist Library" variant="faded">
                    {!checklistLibraryList.length && (
                      <SelectItem key="err">No library found</SelectItem>
                    )}
                    {checklistLibraryList.map(library => (
                      <SelectItem key={library.uid} value={library.uid}>
                        <span>{library.title}</span>
                      </SelectItem>
                    ))}
                  </Select> */}
                  <Select label="Checklist Library" variant="faded">
                    {!checklistLibraryList || !checklistLibraryList.length ? (
                      <SelectItem key="err">No library found</SelectItem>
                    ) : (
                      checklistLibraryList.map(library => (
                        <SelectItem key={library.uid} value={library.uid}>
                          <span>{library.title}</span>
                        </SelectItem>
                      ))
                    )}
                  </Select>

                  <Divider />
                  <Input
                    value={newChecklistTitle}
                    onValueChange={setNewChecklistTitle}
                    isRequired
                    label="Title"
                    variant="faded"
                  />
                  <Input
                    value={newChecklistDescription}
                    onValueChange={setNewChecklistDescription}
                    label="Description"
                    variant="faded"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onClick={() => setOpenAddChecklist(!openAddChecklist)}
                  >
                    Cancel
                  </Button>
                  <ButtonGroup>
                    <Button
                      isDisabled={newChecklistTitle === ''}
                      onClick={handleClose}
                    >
                      {
                        labelsMap[
                          selectedSaveOptionCurrent as keyof typeof labelsMap
                        ]
                      }
                    </Button>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly>
                          <LuChevronDown />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        disallowEmptySelection
                        aria-label="Merge options"
                        selectedKeys={selectedSaveOption}
                        selectionMode="single"
                        onSelectionChange={(setString: any) =>
                          setSelectedSaveOption(setString)
                        }
                        className="max-w-[300px]"
                      >
                        <DropdownItem
                          key="saveOnly"
                          description={descriptionsMap['saveOnly']}
                        >
                          {labelsMap['saveOnly']}
                        </DropdownItem>
                        <DropdownItem
                          key="saveAsLibrary"
                          description={descriptionsMap['saveAsLibrary']}
                        >
                          {labelsMap['saveAsLibrary']}
                        </DropdownItem>
                        <DropdownItem
                          key="onlyLibrary"
                          description={descriptionsMap['onlyLibrary']}
                        >
                          {labelsMap['onlyLibrary']}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </ButtonGroup>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Button isIconOnly variant="faded">
              <AiOutlineEdit />
            </Button>
            <Button isIconOnly variant="faded">
              <FaRegFilePdf />
            </Button>
            <Button isIconOnly variant="faded" onClick={exportToExcel}>
              <FaRegFileExcel />
            </Button>
          </div>
        </div>
        <Divider />
        <Card className="rounded-md overflow-hidden mt-4">
          <div className="flex flex-col h-screen p-4">
            <div className="flex-shrink-0 w-full">{children}</div>
          </div>
        </Card>
      </Card>
    </Fragment>
  );
}
