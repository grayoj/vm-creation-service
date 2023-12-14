export class CreateVmDto {
 name: string;
 memory_mb: number;
 num_vcpus: number;
 description: string;
 num_cores_per_vcpu: number;
 timezone: string;
 boot: {
  uefi_boot: boolean;
  boot_device_order: string[];
 };
 vm_disks: {
  is_cdrom: boolean;
  is_empty: boolean;
  disk_address: {
   device_bus: string;
   device_index: number;
  };
  vm_disk_create?: {
   storage_container_uuid: string;
   size: number;
  };
 }[];
 hypervisor_type: string;
 vm_features: {
  AGENT_VM: boolean;
 };
}
