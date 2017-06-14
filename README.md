# to

`To` simplifies interacting with tabulated CLI data. Pipe the output of a shell command to `to`, and apply javascript functions to it.

## Example

Many shell commands output tabulated data:

```shell
$ df
Filesystem    512-blocks      Used Available Capacity iused      ifree %iused  Mounted on
/dev/disk1     487653376 110844640 376296736    23%  876686 4294090593    0%   /
devfs                370       370         0   100%     640          0  100%   /dev
```

Tabulated data piped to `to` is read into a 2D array named `data`. The user supplies javascript statements to transform the data. In this example, the full data set is returned by supplying the statement `data`, and `to` logs it automatically.

```shell
$ df | to "data"
Filesystem 512-blocks Used Available Capacity iused ifree %iused Mounted on
/dev/disk1 487653376 110841568 376299808 23% 876685 4294090594 0% /
devfs 370 370 0 100% 640 0 100% /dev
```

Say we want to get a list of File System  names. First, we slice `data` to remove the headings:

```shell
$ df | to "data.slice(1)"
/dev/disk1 487653376 110841896 376299480 23% 876666 4294090613 0% /
devfs 370 370 0 100% 640 0 100% /dev
```

Then, we apply a `map` to the array to select the first element of each row:

```shell
$ df | to "data.slice(1)" | to "data.map((d) => d[0])"
/dev/disk1
devfs
```
