import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { MdClose, MdLock } from "react-icons/md";
import Link from "next/link";

const DiseaseModal = ({
  isOpen,
  onClose,
  disease,
  session,
}: {
  isOpen: boolean;
  onClose: () => void;
  disease: any;
  session: any;
}) => {
  if (!isOpen || !disease) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-light flex h-[95vh] flex-col overflow-y-auto border-none md:min-w-[48vw] md:px-10">
        <AlertDialogHeader className="h-fit text-left">
          <AlertDialogTitle className="flex items-center">
            <p className="text-dark font-clash-grotesk flex-1 text-xl font-semibold">
              {disease.title}
            </p>
            <AlertDialogCancel
              onClick={onClose}
              className="border-none text-right shadow-none hover:cursor-pointer hover:opacity-70"
            >
              <MdClose className="size-6" />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex h-full flex-col">
          <div className="relative h-96 w-full overflow-hidden rounded-t-md">
            <Image
              src={disease.image}
              fill
              alt={disease.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="bg-dark text-light w-full flex-1 rounded-b-md px-4 py-4">
            <p className="text-primary text-lg font-semibold">
              {disease.title}
            </p>
            <p className="text-justify">{disease.description}</p>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DiseaseModal;
