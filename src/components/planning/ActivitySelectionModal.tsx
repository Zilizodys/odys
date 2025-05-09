import { Activity } from '@/types/activity'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FiX } from 'react-icons/fi'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { getActivityImageUrl } from '@/types/activity'

interface ActivitySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  activities: Activity[]
  onSelect: (activity: Activity) => void
  slotType: string
}

export default function ActivitySelectionModal({ 
  isOpen, 
  onClose, 
  activities, 
  onSelect,
  slotType 
}: ActivitySelectionModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <FiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                      Choisir une activité pour le créneau {slotType}
                    </Dialog.Title>

                    <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                      {activities.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => {
                            onSelect(activity)
                            onClose()
                          }}
                          className="w-full text-left bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-500 transition-colors"
                        >
                          <div className="flex gap-4 p-4">
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <ImageWithFallback
                                src={getActivityImageUrl(activity)}
                                alt={activity.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{activity.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{activity.address}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5">
                                  {activity.category}
                                </span>
                                {activity.price === 0 ? (
                                  <span className="text-xs text-indigo-600">Gratuit</span>
                                ) : (
                                  <span className="text-xs text-gray-500">{activity.price}€</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 